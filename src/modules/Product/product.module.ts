import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'libs/database/entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { S3CoreModule } from 'libs/s3/src';
import { ImageProduct } from 'libs/database/entities/imageProduct.entity';
import { Order } from 'libs/database/entities/order.entity';
import { OrderProduct } from 'libs/database/entities/orderProduct.entity';
import { CartProduct } from 'libs/database/entities/cartProduct.entity';
import { Collection } from 'libs/database/entities/collection.entity';
import { ProductCollection } from 'libs/database/entities/productCollection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ImageProduct,
      Order,
      OrderProduct,
      CartProduct,
      Collection,
      ProductCollection,
    ]),
    S3CoreModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
