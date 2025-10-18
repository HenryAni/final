import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Taller } from 'src/talleres/entities/taller.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private inscripcionRepo: Repository<Inscripcion>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,

    @InjectRepository(Taller)
    private tallerRepo: Repository<Taller>,
  ) {}

  async crear(dto: CreateInscripcionDto): Promise<Inscripcion> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuarioId } });
    const taller = await this.tallerRepo.findOne({ where: { id: dto.tallerId }, relations: ['inscripciones'] });

    if (!usuario) throw new BadRequestException('Usuario no encontrado');
    if (!taller) throw new BadRequestException('Taller no encontrado');

    if (taller.inscripciones.length >= taller.cupos) {
      throw new BadRequestException('No hay cupos disponibles en este taller');
    }

    const inscripcion = this.inscripcionRepo.create({ usuario, taller });
    return this.inscripcionRepo.save(inscripcion);
  }

  async listar(): Promise<Inscripcion[]> {
    return this.inscripcionRepo.find({ relations: ['usuario', 'taller'] });
  }

  async listarPorTaller(tallerId: number) {
  return this.inscripcionRepo.find({
    where: { taller: { id: tallerId } },
    relations: ['usuario', 'taller'],
  });
}

async listarPorUsuario(usuarioId: number) {
  return this.inscripcionRepo.find({
    where: { usuario: { id: usuarioId } },
    relations: ['usuario', 'taller'],
  });
}

async resumenPorTaller() {
  const resumen = await this.inscripcionRepo
    .createQueryBuilder('inscripcion')
    .leftJoin('inscripcion.taller', 'taller')
    .select('taller.id', 'tallerId')
    .addSelect('taller.nombre', 'nombre')
    .addSelect('taller.cupos', 'cupos')
    .addSelect('COUNT(inscripcion.id)', 'inscritos')
    .groupBy('taller.id')
    .addGroupBy('taller.nombre')
    .addGroupBy('taller.cupos')
    .getRawMany();

  return resumen.map((r) => ({
    ...r,
    cupos: Number(r.cupos),
    inscritos: Number(r.inscritos),
    disponibles: Number(r.cupos) - Number(r.inscritos),
  }));
}


}

