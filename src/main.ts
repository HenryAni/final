import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';



let app: NestExpressApplication;

async function createApp() {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);

    // 🌍 CORS dinámico (acepta solo dominios válidos)
    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:5173',                 // Frontend local
          'https://final-from-cyan.vercel.app/',   // Frontend desplegado
          'https://final-from-cyan.vercel.app',    // Sin barra final
        ];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn('❌ CORS bloqueado:', origin);
          callback(new Error('CORS no permitido'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // 📁 Prefijo global para todos los endpoints
    app.setGlobalPrefix('api');

    // ⚙️ Swagger (solo se inicializa una vez)
    const config = new DocumentBuilder()
      .setTitle('API Congreso de Tecnología')
      .setDescription('Documentación de la API del Congreso de Tecnología 2025')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
  }

  return app;
}

// 🚀 Modo desarrollo local
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Servidor corriendo en: http://localhost:${port}/api`);
  console.log(`📘 Swagger disponible en: http://localhost:${port}/api/docs`);
}

// 🌐 Modo producción (Vercel handler)
export default async function handler(req: any, res: any) {
  // ✅ Manejar preflight manualmente
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(204).end();
    return;
  }

  const app = await createApp();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}

// 🧩 Ejecutar solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
