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
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

import { Role, Roles } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateAddressDto } from './dto/create-Address.dto';
import { GetUser, UserInfoAuth } from 'src/decorator/user.decorator';

@UseGuards(RolesGuard)
@ApiTags('User')
@ApiBearerAuth()
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Roles(Role.User)
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
}
