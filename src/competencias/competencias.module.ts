import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetenciasController } from './competencias.controller';
import { CompetenciasService } from './competencias.service';
import { Competencia } from './entities/competencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competencia])],
  
  providers: [CompetenciasService],
  controllers: [CompetenciasController],
  exports: [CompetenciasService, TypeOrmModule], // necesario para diplomas
})
export class CompetenciasModule {}

