import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3000;
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  logger.log(`App listening on port ${port}`);
}
bootstrap();
