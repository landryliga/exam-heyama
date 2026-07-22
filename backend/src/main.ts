import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app');

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Bloqué par la politique CORS : ${origin}`));
      }
    },
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
    console.warn(
      'Gestion des dossiers statiques ignorée (environnement en lecture seule) :',
      error.message,
    );
  }

  // --- Lancement du serveur ---
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();