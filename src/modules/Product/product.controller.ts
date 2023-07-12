import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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

@UseGuards(RolesGuard)
@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5)) // Limit number of max file
  signUp(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto,files)
  }

  @Get()
  @Roles(Role.Admin)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  findAll(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.productService.findAll(page, pageSize);
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOneById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
  //   return this.productService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
