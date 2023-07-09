import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';
import { CartProduct } from '../entities/cartProduct.entity';
import { Collection } from '../entities/collection.entity';
import { Comment } from '../entities/comment.entity';
import { Order } from '../entities/order.entity';
import { OrderProduct } from '../entities/orderProduct.entity';
import { ProductCollection } from '../entities/productCollection.entity';
import { Video } from '../entities/video.entity';
import { Product } from '../entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database');
        return {
          type: <DatabaseType>databaseConfig.type,
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.database,
          entities: [
            User,
            Address,
            CartProduct,
            Collection,
            Comment,
            Order,
            OrderProduct,
            ProductCollection,
            Video,
            Product,
          ],
          synchronize: false,
          autoLoadEntities: true,
          logging: databaseConfig.logging,
          cli: {
            migrationsDir: __dirname + '/migration',
            entitiesDir: __dirname + '/entities',
          },
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
