import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'libs/database/entities/user.entity';
import { Address } from 'libs/database/entities/address.entity';
import { S3CoreModule } from 'libs/s3/src';
import { Video } from 'libs/database/entities/video.entity';
import { Comment } from 'libs/database/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Video, Comment]),
    S3CoreModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
