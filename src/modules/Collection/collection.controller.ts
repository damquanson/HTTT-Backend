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
  UseInterceptors,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { Roles, Role } from 'src/decorator/roles.decorator';
import { CreateProductDto } from '../Product/dto/CreateProduct.dto';

@Controller('collection')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

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
