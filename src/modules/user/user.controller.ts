import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';

import { Role, Roles } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateAddressDto } from './dto/create-Address.dto';
import { GetUser, UserInfoAuth } from 'src/decorator/user.decorator';
import { CreateVideoDto } from './dto/create-video.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(RolesGuard)
@ApiTags('User')
@ApiBearerAuth()
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('user')
  @Roles(Role.Admin)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.userService.findAll(page, pageSize);
  }

  @Get('user/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete('user/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  //Crud Address Logic

  @Post('address')
  signUp(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser() user: UserInfoAuth,
  ) {
    return this.userService.createAddress(createAddressDto, user.id);
  }
  @Get('address')
  // @Roles(Role.User)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  findAllAddress(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.userService.findAllAddress(page, pageSize);
  }

  @Get('address/:id')
  findOneAddress(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneAddress(id);
  }

  @Patch('address/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.userService.updateAddress(id, createAddressDto);
  }

  @Delete(':id')
  removeAddress(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeAddress(id);
  }

  //Crud Video Admin

  @Get('video')
  @Roles(Role.Admin)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  findAllVideo(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.userService.findAllVideo(page, pageSize);
  }

  @Get('video/:id')
  @Roles(Role.Admin)
  findOneVideo(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneVideo(id);
  }

  @Delete('video/:id')
  @Roles(Role.Admin)
  removeVideo(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeVideo(id);
  }

  // CRUD Video User

  @Get('video-user')
  @Roles(Role.User)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  findAllByUser(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,

    @GetUser() user: UserInfoAuth,
  ) {
    return this.userService.findAllVideoOfUser(page, pageSize, user.id);
  }

  @Get('video-new-feed')
  @Roles(Role.User)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  @ApiQuery({ name: 'seed', type: String })
  findAllVideoUser(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('seed') seed = 'initialSeed',

    @GetUser() user: UserInfoAuth,
  ) {
    return this.userService.newFeedVideo(page, pageSize, seed);
  }

  @Get('video-user/:id')
  @Roles(Role.User)
  findOneVideoUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserInfoAuth,
  ) {
    return this.userService.findOneVideoUser(id, user.id);
  }

  @Delete('video/:id')
  @Roles(Role.User)
  removeVideoUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserInfoAuth,
  ) {
    return this.userService.removeVideoUser(id, user.id);
  }

  @Post('video')
  @Roles(Role.User)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 1)) // Limit number of max file
  uploadVideo(
    @Body() createVideoDto: CreateVideoDto,
    @GetUser() user: UserInfoAuth,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.userService.uploadVideo(createVideoDto, user.id, files);
  }
  @Patch('video/:id')
  updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() createVideoDto: CreateVideoDto,
    @GetUser() user: UserInfoAuth,
  ) {
    return this.userService.updateVideoUser(id, createVideoDto, user.id);
  }
}
