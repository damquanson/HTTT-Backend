import { Injectable } from '@nestjs/common';
import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Address } from 'libs/database/entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepo: AddressService,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    const emailExist = await this.addressRepo.findOneBy({
      email: createAddressDto.email,
    });
    if (emailExist) throw new BadRequestException('Email already exist');

    const saltRounds = 10;
    createAddressDto.password = await bcrypt.hash(
      createAddressDto.password,
      saltRounds,
    );

    const addressCreate = await this.addressRepo.save(createAddressDto);
    const { password, ...result } = addressCreate;
    return result;
  }
  async findAll(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) throw new BadGatewayException();
    const [users, total] = await this.addressRepo.findAndCount({
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
  async findOne(email: string): Promise<Address> {
    return this.addressRepo.findOneBy({ email: email });
  }
  async findOneById(id: number): Promise<Address> {
    const userFound = await this.addressRepo.findOneBy({ id: id });
    if (!userFound) throw new NotFoundException('User Not Found');
    return userFound;
  }

  // update(id: number, updateUserDto: CreateUserDto) {
  //   updateUserDto['userId']=id;
  //   return this.userRepo.save(updateUserDto);
  // }

  remove(id: number): Promise<DeleteResult> {
    return this.addressRepo.softDelete(id);
  }
 
}

