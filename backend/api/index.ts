import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { json, urlencoded } from 'express';
import { AppModule } from '../src/app.module';

const server = express();

server.use(json({ limit: '10mb' }));
server.use(urlencoded({ extended: true, limit: '10mb' }));

let isAppInitialized = false;

async function bootstrap() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    await app.init();
    isAppInitialized = true;
  }
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}