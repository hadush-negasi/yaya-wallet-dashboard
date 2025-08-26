import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  // limit the backend to which to respond  or share data
  app.enableCors({
    origin: ['https://yaya-wallet-dashboard.netlify.app', 'http://localhost:3000'], // netlify deployed app and React dev origins
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();