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
import { ApiQuery, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Roles, Role } from 'src/decorator/roles.decorator';
import { CreateProductDto } from '../Product/dto/CreateProduct.dto';
import { CreateCollectionDto } from './dto/CreateCollection.dto';

@Controller('collection')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get('collection')
  @Roles(Role.Admin)
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'pageSize', type: Number })
  findAllCollection(@Query('page') page = 1, @Query('pageSize') pageSize = 10) {
    return this.collectionService.findAll(page, pageSize);
  }

  @Get('collection/:id')
  @Roles(Role.Admin)
  findOneCollection(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.findOneById(id);
  }

  @Post('collection')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 1)) // Limit number of max file
  createCollection(
    @Body() createCollectionDto: CreateCollectionDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.collectionService.createCollection(createCollectionDto, files);
  }

  @Patch('collection/:id')
  @UseInterceptors(FilesInterceptor('files', 1)) // Limit number of max file
  updateCollection(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCollectionDto: CreateCollectionDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.collectionService.update(id, createCollectionDto, files);
  }

  @Delete('collection/:id')
  @Roles(Role.Admin)
  removeCollection(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.remove(id);
  }

  @Post('add-product/:collectionId/:productId')
  @ApiOperation({ description: 'API add product to collection' })
  addProductToCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.collectionService.addProduct(collectionId, productId);
  }
  @Delete('add-product/:collectionId/:productId')
  @ApiOperation({ description: 'API add product to collection' })
  deleteProductToCollection(
    @Param('collectionId', ParseIntPipe) collectionId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.collectionService.deleteProduct(collectionId, productId);
  }
}
