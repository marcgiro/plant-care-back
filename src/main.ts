import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PlantsModule } from './plants/plants.module';

async function bootstrap() {
  const app = await NestFactory.create(PlantsModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
