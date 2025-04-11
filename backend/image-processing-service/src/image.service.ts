import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageService {
  private minioClient: Minio.Client;

  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @InjectQueue('image-queue') private readonly imageQueue: Queue,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin1',
      secretKey: 'minioadmin1'
    });
  }

  async handleImageUpload(userId: string, imageBuffer: Buffer, originalName: string): Promise<{ id: string, status: string }> {
    const id = uuidv4();
    const filePath = `images/original/${id}-${originalName}`;

    // Загрузка оригинального изображения в Minio
    await this.minioClient.putObject('images', filePath, imageBuffer);
    console.log('Исходное изображение загружено в Minio.');

    // Запись метаданных в базу данных
    const imageEntity = this.imageRepository.create({
      id,
      originalName,
      filePath,
      status: 'pending',
      userId,
    });
    await this.imageRepository.save(imageEntity);

    console.log('Метаданные записаны в базу данных.');

    // Добавляем задачу в очередь для обработки (конвертация, обновление статуса и т.д.)
    await this.imageQueue.add('convert', { id, filePath, userId, originalName, imageBuffer: imageBuffer.toString('base64') });

    return { id, status: 'pending' };
  }

  async getLastImage(userId: string): Promise<any> {
    const image = await this.imageRepository.findOne({ where: { userId }, order: { uploadDate: 'DESC' } });
    if (!image) {
      return { message: 'Изображение не найдено' };
    }
    return image;
  }
}
