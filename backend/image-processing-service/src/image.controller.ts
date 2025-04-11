import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ImageService } from './image.service';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @GrpcMethod('ImageService', 'UploadImage')
  async uploadImage(data: { userId: string; image: Buffer; originalName: string }): Promise<{ id: string, status: string }> {
    // Здесь можно добавить проверку авторизации
    return this.imageService.handleImageUpload(data.userId, data.image, data.originalName);
  }

  @GrpcMethod('ImageService', 'GetLastImage')
  async getLastImage(data: { userId: string }): Promise<any> {
    return this.imageService.getLastImage(data.userId);
  }
}
