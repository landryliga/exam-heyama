import { 
  Controller, 
  Get, 
  Post, 
  Delete,
  Param,  
  Body, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.service';

@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
  ) {}

  @Get()
  async findAll() {
    return this.objectsService.findAll(); 
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body('title') title: string,
    @Body('description') description: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('Le fichier image est obligatoire.');
    }

    return this.objectsService.create(title, description, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.objectsService.delete(id);
  }
}