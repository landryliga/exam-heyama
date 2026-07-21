import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectSchema, AppObject } from './schemas/object.schema'; // Ajuste si ton fichier de schéma s'appelle autrement
import { S3Service } from './s3.service'; // Mème dossier

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AppObject.name, schema: ObjectSchema }]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, S3Service],
  exports: [ObjectsService],
})
export class ObjectsModule {}