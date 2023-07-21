import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'aws-sdk/clients/ssm';
import { validateFiles } from 'libs/util/validate-image';
import { ErrorMessage } from 'src/config/errors.config';
import { Collection, Repository, DeleteResult } from 'typeorm';
import { Readable } from 'typeorm/platform/PlatformTools';
import { CreateProductDto } from '../Product/dto/CreateProduct.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
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
  async findOneById(id: number): Promise<Product> {
    const productFound = await this.productRepo.findOne({
      where: { id: id },
      relations: ['imageProduct'],
    });
    if (!productFound)
      throw new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND);
    return productFound;
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
}
