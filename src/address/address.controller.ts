import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AddressService } from './address.service'
import { AddressDTo } from './dto/address.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserService } from 'src/modules/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';
@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(
    private addressService: AddressService,
    private userService: UserService,
  ) {}
  @Public()
  @Get('register')
  signUp(@Body() addres: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

}
