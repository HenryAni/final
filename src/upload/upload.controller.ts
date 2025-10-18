import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // SOLO memoria storage - compatible con Vercel serverless
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadFile(@UploadedFile() file: Multer.File) {
    if (!file) {
      return { message: 'No se subió ningún archivo.' };
    }

    // Archivo procesado en memoria - compatible con Vercel
    return {
      message: 'Archivo recibido correctamente en memoria',
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      buffer: file.buffer ? 'Buffer disponible' : 'Sin buffer',
      // El archivo está en memoria en file.buffer
      note: 'Archivo procesado en memoria. Para almacenamiento permanente, integrar con AWS S3, Cloudinary, etc.'
    };
  }
}
