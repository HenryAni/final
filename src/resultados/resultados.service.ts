import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';
import { Resultado } from './entities/resultado.entity';

@Injectable()
export class ResultadoService {
  constructor(
    @InjectRepository(Resultado)
    private resultadoRepo: Repository<Resultado>,
  ) {}

  crear(dto: CreateResultadoDto) {
    const nuevo = this.resultadoRepo.create(dto);
    return this.resultadoRepo.save(nuevo);
  }

  listar() {
    return this.resultadoRepo.find({ order: { anio: 'DESC', puesto: 'ASC' } });
  }

  async obtenerUno(id: number) {
    const resultado = await this.resultadoRepo.findOne({ where: { id } });
    if (!resultado) throw new NotFoundException('Resultado no encontrado');
    return resultado;
  }

  async actualizar(id: number, dto: UpdateResultadoDto) {
    const resultado = await this.obtenerUno(id);
    Object.assign(resultado, dto);
    return this.resultadoRepo.save(resultado);
  }

  async eliminar(id: number) {
    const resultado = await this.obtenerUno(id);
    return this.resultadoRepo.remove(resultado);
  }
}
