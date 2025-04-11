import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ImageController } from './image.controller';
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
    ]),
  ],
  controllers: [ImageController],
  providers: [JwtStrategy],
})
export class AppModule {}
