import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const publicPath = join(process.cwd(), 'public');
  const mocksPath = join(publicPath, 'mocks');
  
  if (!fs.existsSync(mocksPath)) {
    fs.mkdirSync(mocksPath, { recursive: true });
  }

  app.useStaticAssets(publicPath, {
    prefix: '/public/',
  });

  app.useStaticAssets(mocksPath, {
    prefix: '/mocks/',
  });

  app.enableCors();
  
  await app.listen(3000);
}
bootstrap();