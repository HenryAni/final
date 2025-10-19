import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      deployment: 'v1.2 - DB connection pooling optimized',
      message: 'API funcionando correctamente',
      uptime: process.uptime(),
      version: '1.2.0'
    };
  }

  @Get('status')
  getStatus() {
    return {
      app: 'Congreso de Tecnología API',
      status: 'RUNNING',
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /',
        'GET /health',
        'GET /status', 
        'GET /api (Swagger)',
        'POST /upload',
        'POST /auth/login',
        'GET /usuarios',
        'GET /talleres'
      ],
      note: 'Aplicación funcionando sin problemas de EROFS'
    };
  }
}
