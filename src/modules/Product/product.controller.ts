import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';

import { RolesGuard } from 'src/auth/roles.guard';
import { ProductService } from './product.service';
import { Roles, Role } from 'src/decorator/roles.decorator';
import { CreateProductDto } from './dto/CreateProduct.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { ChangeStatusDto } from './dto/changeStatus-dto';
import { GetUser, UserInfoAuth } from 'src/decorator/user.decorator';
import { OrderStatus } from 'libs/database/entities/order.entity';

@UseGuards(RolesGuard)
@ApiTags('Product,Order,Cart,Collection')
@ApiBearerAuth()
@Controller('')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('order/create')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.productService.createOrder(createOrderDto);
  }
  @Post('order/change-status')
  changeStatusOrder(
    @Body() changeStatusDto: ChangeStatusDto,
    @GetUser() user: UserInfoAuth,
  ) {
    return this.productService.changeStatusOrder(
      changeStatusDto?.orderId,
      user.id,
      changeStatusDto.status as OrderStatus,
    );
  }

  @Get('cart')
  getCart(@GetUser() user: UserInfoAuth) {
    return this.productService.getCart(user.id);
  }

  @Post('cart/:productId')
  addProduct(
    @Param('productId') productId: number,
    @GetUser() user: UserInfoAuth,
  ) {
    return this.productService.addProductToCart(productId, user.id);
  }

  @Delete('cart/:productId')
  deleteProduct(
    @Param('productId') productId: number,
    @GetUser() user: UserInfoAuth,
  ) {
    return this.productService.deleteProductCart(productId, user.id);
  }

  @Post('product')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5)) // Limit number of max file
  signUp(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
  }

  @Get('product')
  @Roles(Role.Admin)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.productService.findAll(page, pageSize);
  }

  @Get('product/:id')
  @Roles(Role.Admin)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOneById(id);
  }

  @Patch('product/:id')
  update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete('product/:id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Get('collection')
  @Roles(Role.Admin)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  findAllCollection(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.productService.findAll(page, pageSize);
  }

  @Get('collection/:id')
  @Roles(Role.Admin)
  findOneCollection(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOneById(id);
  }

  @Post('collection')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 1)) // Limit number of max file
  createCollection(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
  }

  @Patch('collection/:id')
  updateCollection(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete('collection/:id')
  @Roles(Role.Admin)
  removeCollection(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
