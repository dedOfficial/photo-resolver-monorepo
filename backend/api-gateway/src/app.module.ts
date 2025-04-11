import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ImageController } from './image.controller';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    ClientsModule.register([
      {
        name: 'IMAGE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'image',
          protoPath: join(__dirname, 'proto/image.proto'),
          url: 'image-processing-service:3002',
        },
      },
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, 'proto/auth.proto'),
          url: 'auth-service:3001',
        },
      },
    ]),
  ],
  controllers: [ImageController, AuthController],
  providers: [JwtStrategy],
})
export class AppModule {}
