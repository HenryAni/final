
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';
import { Repository } from 'typeorm';
import { DiplomasService } from '../diplomas/diplomas.service'; // 👈 Importar DiplomasService
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { Asistencia } from './entities/asistencia.entity';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepo: Repository<Asistencia>,

    @InjectRepository(Inscripcion)
    private inscripcionRepo: Repository<Inscripcion>,

    private readonly diplomasService: DiplomasService, // 👈 Inyectar el servicio
  ) {}

  async registrar(dto: CreateAsistenciaDto) {
    // Buscar inscripción según QR y taller
    const inscripcion = await this.inscripcionRepo.findOne({
      where: {
        usuario: { qrCodigo: dto.qrCodigo },
        taller: { id: dto.tallerId },
      },
      relations: ['usuario', 'taller'],
    });

    if (!inscripcion) {
      throw new BadRequestException('El usuario no está inscrito en este taller');
    }

    // Verificar si ya tiene asistencia
    const existe = await this.asistenciaRepo.findOne({
      where: { inscripcion: { id: inscripcion.id } },
    });

    if (existe) {
      throw new BadRequestException('Ya se registró asistencia para este taller');
    }

    // ✅ Registrar la asistencia
    const asistencia = this.asistenciaRepo.create({
      inscripcion,
      fechaRegistro: new Date(),
    });
    await this.asistenciaRepo.save(asistencia);

    // 🎓 Generar automáticamente el diploma si no existe
    try {
      await this.diplomasService.generarDiploma(inscripcion.id);
    } catch (err) {
      console.warn('⚠️ Error al generar diploma automático:', err.message);
    }

    return { message: 'Asistencia registrada y diploma generado automáticamente' };
  }

  async listar(): Promise<Asistencia[]> {
    return this.asistenciaRepo.find({
      relations: ['inscripcion', 'inscripcion.usuario', 'inscripcion.taller'],
    });
  }

  async listarPorTaller(tallerId: number) {
    return this.asistenciaRepo.find({
      where: { inscripcion: { taller: { id: tallerId } } },
      relations: ['inscripcion', 'inscripcion.usuario', 'inscripcion.taller'],
    });
  }

  async listarPorUsuario(usuarioId: number) {
    return this.asistenciaRepo.find({
      where: { inscripcion: { usuario: { id: usuarioId } } },
      relations: ['inscripcion', 'inscripcion.usuario', 'inscripcion.taller'],
    });
  }

  async reportePorTaller() {
    const talleres = await this.asistenciaRepo
      .createQueryBuilder('asistencia')
      .leftJoin('asistencia.inscripcion', 'inscripcion')
      .leftJoin('inscripcion.taller', 'taller')
      .select('taller.id', 'tallerId')
      .addSelect('taller.nombre', 'nombre')
      .addSelect('taller.cupos', 'cupos')
      .addSelect('COUNT(asistencia.id)', 'asistentes')
      .groupBy('taller.id')
      .addGroupBy('taller.nombre')
      .addGroupBy('taller.cupos')
      .getRawMany();

    return talleres.map((t) => ({
      tallerId: t.tallerId,
      nombre: t.nombre,
      cupos: Number(t.cupos),
      asistentes: Number(t.asistentes),
      porcentaje: `${Math.round((Number(t.asistentes) / Number(t.cupos)) * 100)}%`,
    }));
  }
}
