import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'libs/database/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Address } from 'libs/database/entities/address.entity';
import { CreateAddressDto } from './dto/create-Address.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const emailExist = await this.userRepo.findOneBy({
      email: createUserDto.email,
    });
    if (emailExist) throw new BadRequestException('Email already exist');

    const saltRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    createUserDto['avatarUrl'] =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png';
    const userCreate = await this.userRepo.save(createUserDto);
    const { password, ...result } = userCreate;
    return result;
  }

  async findAll(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) throw new BadGatewayException();
    const [users, total] = await this.userRepo.findAndCount({
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

  async findOne(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email: email });
  }
  async findOneById(id: number): Promise<User> {
    const userFound = await this.userRepo.findOneBy({ id: id });
    if (!userFound) throw new NotFoundException('User Not Found');
    return userFound;
  }

  // update(id: number, updateUserDto: CreateUserDto) {
  //   updateUserDto['userId']=id;
  //   return this.userRepo.save(updateUserDto);
  // }

  remove(id: number): Promise<DeleteResult> {
    return this.userRepo.softDelete(id);
  }

  async createAddress(createAddressDto: CreateAddressDto, userId: number) {
    createAddressDto['userId'] = userId;
    const userCreate = await this.addressRepo.save(createAddressDto);
    return userCreate;
  }

  async findAllAddress(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) throw new BadGatewayException();
    const [address, total] = await this.addressRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: address,
      total,
      currentPage: page,
      limit: pageSize,
    };
  }

  async findOneAddress(id: number): Promise<Address> {
    return this.addressRepo.findOneBy({ id: id });
  }

  updateAddress(id: number, updateAddressDto: CreateAddressDto) {
    return this.addressRepo.update(id, updateAddressDto);
  }

  removeAddress(id: number): Promise<DeleteResult> {
    return this.addressRepo.softDelete(id);
  }
}
