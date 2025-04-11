import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  public minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    });
  }

  async onModuleInit() {
    const bucketName = 'images';
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
        this.logger.log(`Bucket "${bucketName}" created successfully.`);
      } else {
        this.logger.log(`Bucket "${bucketName}" already exists.`);
      }
    } catch (error) {
      this.logger.error(`Error checking/creating bucket "${bucketName}":`, error);
    }
  }
}

