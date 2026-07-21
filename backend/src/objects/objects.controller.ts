import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.service';

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body('title') title: string,
    @Body('description') description: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.objectsService.create(title, description, file);
  }

  @Get()
  async findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.objectsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.objectsService.delete(id);
    return { success: true, message: 'Objet et image S3 supprimés avec succès' };
  }
}