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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private s3CoreServices: S3CoreService,
  ) {}
  async findAll(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) throw new BadRequestException();
    const [users, total] = await this.productRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      items: users,
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
    const productCreate = await this.productRepo.save(createProductDto);
    //   const perfix = 'product';
    //   for (const file of files) {
    //     const key = `${perfix}/${uuidv4()}/${file[0].originalname}`;
    //     const fileName = file[0].originalname;
    //     const fileType = file[0].mimetype;
    //     await this.s3Service.uploadFileWithStream(file[0].buffer, key);

    //   }
  }
  async findOneByName(name: string): Promise<Product> {
    return this.productRepo.findOneBy({ name: name });
  }
  async findOneById(id: number): Promise<Product> {
    const productFound = await this.productRepo.findOneBy({ id: id });
    if (!productFound)
      throw new NotFoundException(ErrorMessage.PRODUCT_NOT_FOUND);
    return productFound;
  }

  remove(id: number): Promise<DeleteResult> {
    return this.productRepo.softDelete(id);
  }
}
