import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { S3CoreModule } from 'libs/s3/src';
import { Collection } from 'libs/database/entities/collection.entity';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Product } from 'libs/database/entities/product.entity';
import { ProductCollection } from 'libs/database/entities/productCollection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, Product, ProductCollection]),
    S3CoreModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
