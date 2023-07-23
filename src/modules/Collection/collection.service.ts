import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateFiles } from 'libs/util/validate-image';
import { ErrorMessage } from 'src/config/errors.config';
import { Repository, DeleteResult } from 'typeorm';
import { Readable } from 'typeorm/platform/PlatformTools';
import { CreateProductDto } from '../Product/dto/CreateProduct.dto';
import { Collection } from 'libs/database/entities/collection.entity';
import { S3CoreService } from 'libs/s3/src';
import { CreateCollectionDto } from './dto/CreateCollection.dto';
import { v4 as uuidv4 } from 'uuid';
import { Product } from 'libs/database/entities/product.entity';
import { ProductCollection } from 'libs/database/entities/productCollection.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductCollection)
    private productCollectionRepo: Repository<ProductCollection>,
    private s3CoreServices: S3CoreService,
  ) {}
  async findAll(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) throw new BadRequestException();
    const [collection, total] = await this.collectionRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const collectionWithImage = await Promise.all(
      collection.map(async (item) => {
        const imageLink = await this.s3CoreServices.getLinkFromS3(item.image);
        return {
          ...item,
          imageLink,
        };
      }),
    );
    return {
      list: collectionWithImage,
      total,
      currentPage: page,
      limit: pageSize,
    };
  }

  async createCollection(
    createCollectionDto: CreateCollectionDto,
    files: Express.Multer.File[],
  ) {
    if (!validateFiles(files))
      throw new BadRequestException(ErrorMessage.VALIDATE_FILE_FAILED);

    //todo Implement transaction

    const prefix = 'collection';
    let key: string;
    console.log(files);
    for (const file of files) {
      key = `${prefix}/${uuidv4()}/${file.originalname}`;
      const fileName = file.originalname;
      const fileType = file.mimetype;
      const fileSize = file.size;

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null); // End the stream
      await this.s3CoreServices.uploadFileWithStream(readableStream, key);
      createCollectionDto['image'] = key;
    }

    const collectionCreate = await this.collectionRepo.save(
      createCollectionDto,
    );
    return await this.collectionRepo.findOne({
      where: { id: collectionCreate.id },
    });
  }
  async findOneById(id: number) {
    const collectionFound = await this.collectionRepo.findOne({
      where: { id: id },
    });

    collectionFound['imageLink'] = await this.s3CoreServices.getLinkFromS3(
      collectionFound.image,
    );

    if (!collectionFound) throw new NotFoundException('COLLECTION_NOT_FOUND');
    const listProductCollection = await this.productCollectionRepo.find({
      where: { collectionId: id },
    });

    let productList: Product[];
    for (const productId of listProductCollection) {
      const productFound = await this.productRepo.findOne({
        where: { id: productId.productId },
        relations: ['imageProduct'],
      });
      if (!productFound)
        throw new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND);

      for (const image of productFound.imageProduct) {
        image['imageLink'] = await this.s3CoreServices.getLinkFromS3(image.key);
      }
      productList.push(productFound);
    }
    return { collection: collectionFound, productList: productList };
  }

  async update(
    id: number,
    updateCollectionDto: CreateCollectionDto,
    files: Express.Multer.File[],
  ) {
    const prefix = 'collection';
    let key: string;
    for (const file of files) {
      key = `${prefix}/${uuidv4()}/${file.originalname}`;
      const fileName = file.originalname;
      const fileType = file.mimetype;
      const fileSize = file.size;

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null); // End the stream
      await this.s3CoreServices.uploadFileWithStream(readableStream, key);
    }
    updateCollectionDto['image'] = key;

    return (
      (await this.collectionRepo.update(id, updateCollectionDto)).affected > 0
    );
  }

  remove(id: number): Promise<DeleteResult> {
    return this.collectionRepo.softDelete(id);
  }

  async addProduct(collectionId: number, productId: number) {
    const collectionFound = await this.collectionRepo.find({
      where: { id: collectionId },
    });
    const productFound = await this.productRepo.find({
      where: { id: productId },
    });
    if (!collectionFound || !productFound) throw new NotFoundException();
    return await this.productCollectionRepo.save({
      collectionId: collectionId,
      productId: productId,
    });
  }

  async deleteProduct(collectionId: number, productId: number) {
    const collectionFound = await this.collectionRepo.find({
      where: { id: collectionId },
    });
    const productFound = await this.productRepo.find({
      where: { id: productId },
    });
    if (!collectionFound || !productFound) throw new NotFoundException();
    const productCollectionFound = await this.productCollectionRepo.findOne({
      where: {
        collectionId: collectionId,
        productId: productId,
      },
    });

    if (productCollectionFound) {
      throw new NotFoundException('Product not found in the collection');
    }
    return await this.productCollectionRepo.softDelete(
      productCollectionFound.id,
    );
  }
}
