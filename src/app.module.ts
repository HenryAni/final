import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { CompetenciasModule } from './competencias/competencias.module';
import { DiplomasModule } from './diplomas/diplomas.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { ResultadosModule } from './resultados/resultados.module';
import { TalleresModule } from './talleres/talleres.module';
import { UploadModule } from './upload/upload.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ solo en desarrollo
        ssl: config.get<boolean>('DB_SSL') ? { rejectUnauthorized: false } : false,
        // Configuración optimizada para Vercel serverless
        extra: {
          max: 1, // Máximo 1 conexión por instancia serverless
          connectionTimeoutMillis: 5000,
          idleTimeoutMillis: 10000,
        },
        poolSize: 1, // Una sola conexión por pool
        connectTimeoutMS: 5000,
        acquireTimeoutMillis: 5000,
        logging: process.env.NODE_ENV !== 'production',
      }),

    }),
    UsuariosModule,
    TalleresModule,
    InscripcionesModule,
    AsistenciaModule,
    DiplomasModule,
    ResultadosModule,
    AuthModule,
    CompetenciasModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
