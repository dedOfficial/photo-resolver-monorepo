import { Controller, Post, UseInterceptors, UploadedFile, Req, Get, Param, BadRequestException, UseGuards, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Inject } from '@nestjs/common';
import { Request } from 'express';

interface ImageService {
  UploadImage(data: { userId: string; image: Buffer; originalName: string }): Observable<{ id: string; status: string }>;
  GetLastImage(data: { userId: string }): Observable<any>;
}

@Controller('images')
export class ImageController {
  // Используем уверенное присвоение, чтобы TypeScript не жаловался на неинициализированное поле
  private imageService!: ImageService;

  constructor(@Inject('IMAGE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.imageService = this.client.getService<ImageService>('ImageService');
  }

  // Применяем JWT-гард, чтобы req.user заполнялся автоматически
  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException('Файл не передан. Убедитесь, что отправляете запрос с multipart/form-data и поле называется "file"');
    }

    // Получаем пользователя из req.user (предполагается, что JwtStrategy корректно его заполняет)
    const user = req.user as { id: string };
    if (!user || !user.id) {
      throw new UnauthorizedException('Пользователь не аутентифицирован');
    }
    
    const userId = user.id; 
    const originalName = file.originalname;
    const buffer = file.buffer;
    
    const response = await this.imageService
      .UploadImage({ userId, image: buffer, originalName })
      .toPromise();
    return response;
  }

  @Get(':userId/last')
  async getLastImage(@Param('userId') userId: string) {
    const response = await this.imageService.GetLastImage({ userId }).toPromise();
    return response;
  }
}