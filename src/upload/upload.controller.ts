import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // Solo usar memoria para evitar problemas en Vercel
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

    // Siempre usar memoria - compatible con Vercel
    return {
      message: 'Archivo recibido correctamente',
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      // El archivo está en memoria en file.buffer
      note: 'Archivo procesado en memoria. Para almacenamiento permanente, integrar con AWS S3, Cloudinary, etc.'
    };
  }
}
