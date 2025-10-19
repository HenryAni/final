import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

let app: NestExpressApplication;

async function createApp() {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);

    // ✅ CORS seguro (NestJS nativo)
    app.enableCors({
      origin: [
        'http://localhost:5173',           // para desarrollo local
        'https://congresf.vercel.app',     // frontend en producción
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await app.init(); // 👈 Inicializar antes de Swagger

    // 📘 Swagger
    const config = new DocumentBuilder()
      .setTitle('API Congreso de Tecnología')
      .setDescription('Documentación de la API con Swagger')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  return app;
}

// 🚀 Desarrollo local
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Servidor en: http://localhost:${port}`);
}

// 🌐 Vercel handler
export default async function handler(req: any, res: any) {
  // ✅ Responder preflight manualmente
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://congresf.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return;
  }

  const app = await createApp();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}

// Solo ejecutar bootstrap en desarrollo
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
