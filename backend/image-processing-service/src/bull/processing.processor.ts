import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '../image.entity';

@Injectable()
@Processor('image-queue')
export class ImageProcessingProcessor {
  private minioClient: Minio.Client;

  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin1',
      secretKey: 'minioadmin1'
    });
  }

  @Process('convert')
  async handleImageConversion(job: Job) {
    const { id, filePath, userId, originalName, imageBuffer } = job.data;
    const outputPath = `images/processed/${id}-${originalName}.webp`;

    const isBuffer = Buffer.isBuffer(imageBuffer);

    // Преобразуем строку base64 обратно в Buffer, если это не Buffer
    const buffer = isBuffer
      ? imageBuffer
      : Buffer.from(imageBuffer, 'base64');
    
    console.log(isBuffer ? `Изначально Buffer: ${buffer}` : `Изначально base64 формат. Преобразовано в Buffer: ${buffer}`);

    // Конвертация изображения в webp (80% качество)
    await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer()
      .then(async (outputBuffer) => {
        console.log('Изображение обработано успешно!');
        // Загрузка обработанного изображения в Minio
        await this.minioClient.putObject('images', outputPath, outputBuffer);
        console.log('Озображение загружено успешно!');
      })
      .catch((err) => {
        console.error('Ошибка обработки изображения:', err);
      });

    // Обновление статуса в базе
    await this.imageRepository.update(id, { status: 'processed', filePath: outputPath });
    console.log('Статус в базе обновлен!');

    return { status: 'processed', id };
  }
}