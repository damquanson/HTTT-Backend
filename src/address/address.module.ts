import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { UserModule } from 'src/modules/user/user.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
@Module({
  imports: [
    ,
  ],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
