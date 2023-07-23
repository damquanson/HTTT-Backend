import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'libs/database/entities/product.entity';
import { ErrorMessage } from 'src/config/errors.config';
import { DeleteResult, Repository } from 'typeorm';
import { Collection } from 'libs/database/entities/collection.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Collection } from 'libs/database/entities/collection.entity';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { validateFiles } from 'libs/util/validate-image';
import { S3CoreService } from 'libs/s3/src';
import { v4 as uuidv4 } from 'uuid';
import { ImageProduct } from 'libs/database/entities/imageProduct.entity';
import { Readable } from 'stream';
import { Order, OrderStatus } from 'libs/database/entities/order.entity';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { OrderProduct } from 'libs/database/entities/orderProduct.entity';
import { CartProduct } from 'libs/database/entities/cartProduct.entity';
import { ProductCollection } from 'libs/database/entities/productCollection.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
    @InjectRepository(ProductCollection)
    private productCollectionRepo: Repository<ProductCollection>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepo: Repository<OrderProduct>,
    @InjectRepository(CartProduct)
    private cartProductRepo: Repository<CartProduct>,
    @InjectRepository(ImageProduct) private imageRepo: Repository<ImageProduct>,
    private s3CoreServices: S3CoreService,
  ) {}
  async findAll(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) throw new BadRequestException();
    const [product, total] = await this.productRepo.findAndCount({
      relations: ['imageProduct'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    product.map(async (item) => {
      for (const image of item.imageProduct) {
        image['imageLink'] = await this.s3CoreServices.getLinkFromS3(image.key);
      }
      return item;
    });
    return {
      productList: product,
      total,
      currentPage: page,
      limit: pageSize,
    };
  }

  async createProduct(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    if (!validateFiles(files))
      throw new BadRequestException(ErrorMessage.VALIDATE_FILE_FAILED);

    const priceAsNumber = parseInt(createProductDto.price);
    const quantityAsNumber = parseInt(createProductDto.quantity);
    const createProductDtoNumber = {
      ...createProductDto,
      price: priceAsNumber,
      quantity: quantityAsNumber,
    };
    //todo Implement transaction
    const productCreate = await this.productRepo.save(createProductDtoNumber);
    const prefix = 'product';

    for (const file of files) {
      const key = `${prefix}/${uuidv4()}/${file.originalname}`;
      const fileName = file.originalname;
      const fileType = file.mimetype;
      const fileSize = file.size;

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null); // End the stream
      await this.s3CoreServices.uploadFileWithStream(readableStream, key);
      await this.imageRepo.save({
        key: key,
        fileName: fileName,
        mimeType: fileType,
        productId: productCreate.id,
        size: fileSize,
      });
    }
    return await this.productRepo.findOne({
      where: { id: productCreate.id },
      relations: ['imageProduct'],
    });
  }
  async findOneById(id: number) {
    const productFound = await this.productRepo.findOne({
      where: { id: id },
      relations: ['imageProduct'],
    });
    if (!productFound)
      throw new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND);

    for (const image of productFound.imageProduct) {
      image['imageLink'] = await this.s3CoreServices.getLinkFromS3(image.key);
    }

    let collectionList: Collection[] = [];
    const productCollection = await this.productCollectionRepo.find({
      where: { productId: id },
    });
    for (const collection of productCollection) {
      const collectionFound = await this.collectionRepo.findOne({
        where: { id: collection.collectionId },
      });

      collectionFound['imageLink'] = await this.s3CoreServices.getLinkFromS3(
        collectionFound.image,
      );

      collectionList.push(collectionFound);
    }
    return { product: productFound, collectionList: collectionList };
  }

  async update(id: number, updateProductDto: CreateProductDto) {
    const priceAsNumber = parseInt(updateProductDto.price);
    const quantityAsNumber = parseInt(updateProductDto.quantity);
    const updateProductDtoNumber = {
      ...updateProductDto,
      price: priceAsNumber,
      quantity: quantityAsNumber,
    };
    return (
      (await this.productRepo.update(id, updateProductDtoNumber)).affected > 0
    );
  }

  remove(id: number): Promise<DeleteResult> {
    return this.productRepo.softDelete(id);
  }
  //Logic CRUD Order
  async createOrder(createOrderDto: CreateOrderDto) {
    createOrderDto.total = 0;
    createOrderDto['status'] = OrderStatus.CONFIRMED;
    const orderCreate = await this.orderRepo.save(createOrderDto);
    let total = 0;
    const orderProduct = await Promise.all(
      createOrderDto?.productIdArray.map(async (item) => {
        const productFound = await this.productRepo.findOne({
          where: { id: item },
        });
        total = total + productFound.price;
        return {
          productId: item,
          orderId: orderCreate.id,
        };
      }),
    );
    await this.orderProductRepo.save(orderProduct);
    orderCreate.total = total;
    const orderCreateFinal = await this.orderRepo.save(createOrderDto);

    return orderCreateFinal;
  }
  async changeStatusOrder(
    orderId: number,
    userId: number,
    status: OrderStatus,
  ) {
    console.log(orderId, userId);
    const orderFound = await this.orderRepo.findOne({
      where: { id: orderId, userId: userId },
    });
    if (!orderFound)
      throw new BadRequestException(ErrorMessage.ORDER_NOT_FOUND);
    orderFound.status = status;
    await this.orderRepo.save(orderFound);
    return true;
  }

  //Logic Add/Delete To Cart
  async addProductToCart(productId: number, userId: number) {
    const productUser = await this.cartProductRepo.findOne({
      where: {
        productId: productId,
        userId: userId,
      },
    });
    if (!productUser)
      return await this.cartProductRepo.save({
        productId: productId,
        userId: userId,
      });
  }
  async deleteProductCart(productId: number, userId: number) {
    const productUser = await this.cartProductRepo.findOne({
      where: {
        productId: productId,
        userId: userId,
      },
    });
    if (productUser)
      return (
        (await this.cartProductRepo.softDelete(productUser.id)).affected > 0
      );
  }
  async getCart(userId: number) {
    return await this.cartProductRepo.find({ where: { userId: userId } });
  }
}
