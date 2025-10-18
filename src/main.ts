import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as fs from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // 👇 Usa NestExpressApplication para servir archivos estáticos
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

const uploadsPath = resolve(process.cwd(), 'uploads');
console.log('📂 Sirviendo carpeta:', uploadsPath, fs.existsSync(uploadsPath));

app.use('/uploads', express.static(uploadsPath));

  // 🔐 Habilitar CORS (para que Vue pueda acceder)
  app.enableCors({
    origin: 'http://localhost:5173', // tu frontend
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


  // 🚀 Iniciar servidor
 const port = process.env.PORT || 3000;
await app.listen(port);
  console.log(`✅ Servidor iniciado en: http://localhost:${port}`);
  console.log(`📸 Archivos disponibles en: http://localhost:${port}/uploads`);

}
bootstrap();

