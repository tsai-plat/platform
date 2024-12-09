import { NestFactory } from '@nestjs/core';
import { ApiV1Module } from './api-v1.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiV1Module);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
