import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resultado } from './entities/resultado.entity';
import { ResultadosController } from './resultados.controller';
import { ResultadoService } from './resultados.service';

@Module({
  imports: [TypeOrmModule.forFeature([Resultado])],
  controllers: [ResultadosController],
  providers: [ResultadoService],
  exports: [ResultadoService],
})
export class ResultadosModule {}
