import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'aws-sdk/clients/ssm';
import { validateFiles } from 'libs/util/validate-image';
import { ErrorMessage } from 'src/config/errors.config';
import { Repository, DeleteResult } from 'typeorm';
import { Readable } from 'typeorm/platform/PlatformTools';
import { CreateProductDto } from '../Product/dto/CreateProduct.dto';
import { Collection } from 'libs/database/entities/collection.entity';
import { S3CoreService } from 'libs/s3/src';
import { CreateCollectionDto } from './dto/CreateProduct.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepo: Repository<Collection>,
    private s3CoreServices: S3CoreService,
  ) {}
  async findAll(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) throw new BadRequestException();
    const [collection, total] = await this.collectionRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      list: collection.map(async (item) => {
        const imageLink = await this.s3CoreServices.getLinkFromS3(item.image);
        return {
          ...item,
          imageLink,
        };
      }),
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
    createCollectionDto['image'] = key;
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
    if (!collectionFound) throw new NotFoundException('COLLECTION_NOT_FOUND');
    return collectionFound;
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
}
