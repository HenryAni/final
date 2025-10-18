import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';

let app: NestExpressApplication;

async function createApp() {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Solo configurar archivos estáticos en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      const uploadsPath = resolve(process.cwd(), 'uploads');
      console.log('📂 Sirviendo carpeta:', uploadsPath, fs.existsSync(uploadsPath));

      // Crear carpeta uploads si no existe (solo en desarrollo)
      if (!fs.existsSync(uploadsPath)) {
        try {
          fs.mkdirSync(uploadsPath, { recursive: true });
        } catch (error) {
          console.warn('⚠️ No se pudo crear carpeta uploads:', error.message);
        }
      }

      app.use('/uploads', express.static(uploadsPath));
    }

    // 🔐 Habilitar CORS
    app.enableCors({
      origin: ['http://localhost:5173', 'https://your-frontend-domain.vercel.app'],
      credentials: true,
    });

    // 📘 Configuración de Swagger
    const config = new DocumentBuilder()
      .setTitle('API Congreso de Tecnología')
      .setDescription('Documentación de la API con Swagger')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  }
  return app;
}

// Para desarrollo local
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Servidor iniciado en: http://localhost:${port}`);
  console.log(`📸 Archivos disponibles en: http://localhost:${port}/uploads`);
}

// Para Vercel (serverless)
export default async function handler(req: any, res: any) {
  const app = await createApp();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}

// Solo ejecutar bootstrap en desarrollo
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

