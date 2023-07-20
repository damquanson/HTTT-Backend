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
import { GetUser } from 'src/decorator/user.decorator';

@UseGuards(RolesGuard)
@ApiTags('Product And Order')
@ApiBearerAuth()
@Controller('')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('order/create')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.productService.createOrder(createOrderDto);
  }

  // @Post('order/change-status')
  // changeStatusOrder(
  //   @Body() changeStatusDto: ChangeStatusDto,
  //   @GetUser() user: any,
  // ) {
  //   return this.productService.changeStatusOrder(
  //     changeStatusDto?.productId,
  //     user.id
  //     changeStatusDto.status,
  //   );
  // }

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
}
