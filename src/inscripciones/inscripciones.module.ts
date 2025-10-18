import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Taller } from 'src/talleres/entities/taller.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Usuario, Taller])],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
})
export class InscripcionesModule {}

