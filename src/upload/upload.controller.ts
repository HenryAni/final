import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import type { Multer } from 'multer';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'node:path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // Usar memoria en producción (Vercel), disco en desarrollo
      storage: process.env.NODE_ENV === 'production' 
        ? memoryStorage()
        : diskStorage({
            destination: (req, file, callback) => {
              const uploadDir = './uploads';
              // Crear directorio solo si no existe y no estamos en producción
              if (!fs.existsSync(uploadDir)) {
                try {
                  fs.mkdirSync(uploadDir, { recursive: true });
                } catch (error) {
                  // Ignorar error si no se puede crear
                }
              }
              callback(null, uploadDir);
            },
            filename: (req, file, callback) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              callback(null, `${uniqueSuffix}${ext}`);
            },
          }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  uploadFile(@UploadedFile() file: Multer.File) {
    if (!file) {
      return { message: 'No se subió ningún archivo.' };
    }

    if (process.env.NODE_ENV === 'production') {
      // En producción (Vercel), devolver información del archivo en memoria
      return {
        message: 'Archivo recibido en memoria (usar servicio de almacenamiento externo)',
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        // En producción real, aquí subirías el archivo a AWS S3, Cloudinary, etc.
        note: 'Para almacenamiento permanente, integrar con servicio externo'
      };
    }

    // En desarrollo, funciona normal
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/uploads/${file.filename}`;

    return { 
      message: 'Archivo subido exitosamente',
      url,
      filename: file.filename,
      size: file.size
    };
  }
}
