import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'https://exam-heyama.vercel.app/',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
  });

  try {
    const publicPath = join(process.cwd(), 'public');
    const mocksPath = join(publicPath, 'mocks');

    if (!fs.existsSync(mocksPath)) {
      fs.mkdirSync(mocksPath, { recursive: true });
    }

    app.useStaticAssets(publicPath, { prefix: '/public/' });
    app.useStaticAssets(mocksPath, { prefix: '/mocks/' });
  } catch (error) {
    console.warn('Gestion du dossier statique ignorée (lecture seule) :', error.message);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();