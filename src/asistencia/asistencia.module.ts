import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';
import { DiplomasModule } from '../diplomas/diplomas.module'; // 👈 Importa el módulo de diplomas
import { AsistenciaController } from './asistencia.controller';
import { AsistenciaService } from './asistencia.service';
import { Asistencia } from './entities/asistencia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asistencia, Inscripcion]),
    forwardRef(() => DiplomasModule), // 👈 Para usar DiplomasService sin errores circulares
  ],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
  exports: [AsistenciaService],
})
export class AsistenciaModule {}
