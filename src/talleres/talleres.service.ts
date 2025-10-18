import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { Taller } from './entities/taller.entity';

@Injectable()
export class TalleresService {
  constructor(
    @InjectRepository(Taller)
    private readonly repo: Repository<Taller>,
  ) {}


async create(dto: CreateTallerDto): Promise<Taller> {
  const entity = new Taller();
  entity.nombre = dto.nombre;
  entity.descripcion = dto.descripcion;
  entity.cupos = dto.cupos ?? 0;
  entity.lugar = dto.lugar;

  // Convertir strings ISO a Date (si vienen en el DTO)
  if (dto.fechaInicio) {
    entity.fechaInicio = new Date(dto.fechaInicio as string);
  }
  if (dto.fechaFin) {
    entity.fechaFin = new Date(dto.fechaFin as string);
  }

  return this.repo.save(entity);
}



  async findAll(): Promise<Taller[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Taller> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException(`Taller con id ${id} no encontrado`);
    return t;
  }

 async update(id: number, dto: UpdateTallerDto): Promise<Taller> {
  const taller = await this.findOne(id);

  if (dto.nombre !== undefined) taller.nombre = dto.nombre;
  if (dto.descripcion !== undefined) taller.descripcion = dto.descripcion;
  if (dto.cupos !== undefined) taller.cupos = dto.cupos;
  if (dto.lugar !== undefined) taller.lugar = dto.lugar;
  if (dto.fechaInicio) taller.fechaInicio = new Date(dto.fechaInicio as string);
  if (dto.fechaFin) taller.fechaFin = new Date(dto.fechaFin as string);

  return this.repo.save(taller);
}


  async remove(id: number): Promise<void> {
    const r = await this.repo.delete(id);
    if (r.affected === 0) throw new NotFoundException(`Taller con id ${id} no encontrado`);
  }
}

