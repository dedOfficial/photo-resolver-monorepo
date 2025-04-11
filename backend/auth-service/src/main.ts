import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, 'proto/auth.proto'),
      url: '0.0.0.0:3001',  // слушаем на всех интерфейсах, порт 3001
    },
  });
  
  await app.listen();
  console.log('gRPC Auth Service is listening on port 3001');
}
bootstrap();