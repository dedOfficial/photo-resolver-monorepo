import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'image',
      protoPath: join(__dirname, 'proto/image.proto'),
      url: '0.0.0.0:3002',
    },
  });
  await app.listen();
}
bootstrap();
