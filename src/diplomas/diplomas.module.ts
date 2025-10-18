import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';

import { DiplomasController } from './diplomas.controller';
import { DiplomasService } from './diplomas.service';
import { Diploma } from './entities/diploma.entity';

@Module({
imports: [
  TypeOrmModule.forFeature([Diploma, Inscripcion]),
],
exports: [DiplomasService],
  controllers: [DiplomasController],
  providers: [DiplomasService],
})
export class DiplomasModule {}

