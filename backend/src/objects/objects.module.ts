import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { AppObject, ObjectSchema } from './object.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AppObject.name, schema: ObjectSchema }]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}