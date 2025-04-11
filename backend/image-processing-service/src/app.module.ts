import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { BullModule } from '@nestjs/bull';
import { ImageProcessingProcessor } from './bull/processing.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { MinioService } from './minio.service'; // Импорт нового сервиса

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'image-queue'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'photo-resolver',
      entities: [ImageEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ImageEntity]),
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageProcessingProcessor, MinioService],
})
export class AppModule {}
