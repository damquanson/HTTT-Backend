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
import { CreateVideoDto } from './dto/create-video.dto';
import { validateFiles } from 'libs/util/validate-image';
import { S3CoreService } from 'libs/s3/src';
import { ErrorMessage } from 'src/config/errors.config';
import { Readable } from 'typeorm/platform/PlatformTools';
import { v4 as uuidv4 } from 'uuid';
import { Video } from 'libs/database/entities/video.entity';
import { Comment } from 'libs/database/entities/comment.entity';
const seedrandom = require('seedrandom').default;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    @InjectRepository(Video) private videoRepo: Repository<Video>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,

    private s3CoreServices: S3CoreService,
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

  //Video and Comment
  async uploadVideo(
    createVideoDto: CreateVideoDto,
    userId: number,
    files: Express.Multer.File[],
  ) {
    if (!validateFiles(files))
      throw new BadRequestException(ErrorMessage.VALIDATE_FILE_FAILED);

    const productIdAsNumber = parseInt(createVideoDto.productId);
    const createVideoDtoNumber = {
      ...createVideoDto,
      productId: productIdAsNumber,
      userId: userId,
    };
    //todo Implement transaction
    const prefix = 'video';
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
    const link = await this.s3CoreServices.getLinkFromS3(key);
    createVideoDtoNumber['link'] = link;
    const videoCreate = await this.videoRepo.save(createVideoDtoNumber);

    return videoCreate;
  }

  async findAllVideo(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) throw new BadGatewayException();
    const [items, total] = await this.videoRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: items,
      total,
      currentPage: page,
      limit: pageSize,
    };
  }

  async findAllVideoOfUser(page: number, pageSize: number, userId: number) {
    if (page < 1 || pageSize < 1) throw new BadGatewayException();
    const [items, total] = await this.videoRepo.findAndCount({
      where: { userId: userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: items,
      total,
      currentPage: page,
      limit: pageSize,
    };
  }

  // Hàm đánh tráo mảng dựa trên seed
  shuffleArrayWithSeed(array: any[], seed: string): any[] {
    const random = this.generateRandomNumber(seed);

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  // Hàm sinh số ngẫu nhiên dựa trên seed
  generateRandomNumber(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const maxInt32 = 0x7fffffff;
    const random = () => (hash & maxInt32) / maxInt32;
    return random;
  }
  async newFeedVideo(page: number, pageSize: number, seed: string) {
    if (page < 1 || pageSize < 1) throw new BadGatewayException();
    const [items, total] = await this.videoRepo.findAndCount();

    // Đánh tráo mảng items dựa trên seed
    const shuffledItems = this.shuffleArrayWithSeed([...items], seed);

    // Tính toán chỉ mục bắt đầu và kết thúc để phân trang
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Lấy các items tương ứng với trang được yêu cầu
    const paginatedItems = shuffledItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total,
      currentPage: page,
      limit: pageSize,
    };
  }

  async findOneVideo(id: number): Promise<Video> {
    return this.videoRepo.findOneBy({ id: id });
  }

  // updateAddress(id: number, updateAddressDto: CreateAddressDto) {
  //   return this.addressRepo.update(id, updateAddressDto);
  // }

  removeVideo(id: number): Promise<DeleteResult> {
    return this.videoRepo.softDelete(id);
  }

  async findOneVideoUser(id: number, userId: number): Promise<Video> {
    const videoFound = await this.videoRepo.findOneBy({
      id: id,
      userId: userId,
    });
    if (!videoFound) throw new NotFoundException();
    return videoFound;
  }

  async updateVideoUser(
    id: number,
    updateVideoDto: CreateVideoDto,
    userId: number,
  ) {
    const videoFound = await this.videoRepo.findOneBy({
      id: id,
      userId: userId,
    });
    if (!videoFound) throw new NotFoundException();
    const productIdAsNumber = parseInt(updateVideoDto.productId);
    const createVideoDtoNumber = {
      ...updateVideoDto,
      productId: productIdAsNumber,
    };
    return this.videoRepo.update(id, createVideoDtoNumber);
  }

  async removeVideoUser(id: number, userId: number) {
    const videoFound = await this.videoRepo.findOneBy({
      id: id,
      userId: userId,
    });
    if (!videoFound) throw new NotFoundException();
    return (await this.videoRepo.softDelete(id)).affected > 0;
  }

  async addCommentToVideo(comment: string, userId: number, videoId: number) {
    const videoFound = await this.videoRepo.findOneBy({
      id: videoId,
    });
    if (!videoFound) throw new NotFoundException();
    await this.commentRepo.save({
      content: comment,
      userId: userId,
      videoId: videoId,
    });
  }
  async deleteCommentToVideo(commentId: number) {
    return await this.commentRepo.softDelete(commentId);
  }

  async updateComment(commentId: number, content: string) {
    return await this.commentRepo.update(commentId, { content: content });
  }
}
