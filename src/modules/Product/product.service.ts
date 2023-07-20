import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'libs/database/entities/product.entity';
import { ErrorMessage } from 'src/config/errors.config';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { validateFiles } from 'libs/util/validate-image';
import { S3CoreService } from 'libs/s3/src';
import { v4 as uuidv4 } from 'uuid';
import { ImageProduct } from 'libs/database/entities/imageProduct.entity';
import { create } from 'domain';
import { Readable } from 'stream';
import { Order } from 'libs/database/entities/order.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
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
    return {
      items: product,
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
    console.log(files);
    console.log(createProductDto);
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
  async findOneById(id: number): Promise<Product> {
    const productFound = await this.productRepo.findOne({
      where: { id: id },
      relations: ['imageProduct'],
    });
    if (!productFound)
      throw new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND);
    return productFound;
  }

  async updateProduct(id: number, updateProductDto: CreateProductDto) {
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
}
