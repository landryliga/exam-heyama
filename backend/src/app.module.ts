import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjectsModule } from './modules/objets/objects.module';
import { S3Service } from './modules/objets/s3.service'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongo:27017/heyama-exam'),
    ObjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service],
})
export class AppModule {}