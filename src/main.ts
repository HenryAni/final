import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

let app: NestExpressApplication;

async function createApp() {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);

    // ✅ Habilitar CORS usando el método nativo de NestJS
    app.enableCors({
      origin: [
        'http://localhost:5173',          // desarrollo local
        'https://congresf.vercel.app',    // frontend principal
        'https://final-from-five.vercel.app', // otro frontend (si lo usas)
        'https://pruebaaa-gilt.vercel.app', // dominio anterior (temporal)
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
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

// 🚀 Bootstrap local (solo cuando no está en producción)
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Servidor iniciado en: http://localhost:${port}`);
  console.log(`📸 Archivos disponibles en: http://localhost:${port}/uploads`);
}

// 🌐 Handler para Vercel (serverless)
export default async function handler(req: any, res: any) {
  const app = await createApp();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
