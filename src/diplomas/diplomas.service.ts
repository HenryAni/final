import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { Repository } from 'typeorm';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Diploma } from './entities/diploma.entity';

@Injectable()
export class DiplomasService {
  constructor(
    @InjectRepository(Diploma)
    private readonly diplomaRepo: Repository<Diploma>,

    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,
  ) {}

  // 📄 Generar diploma con PDF válido
  async generarDiploma(
    inscripcionId: number,
    tipo: 'taller' | 'competencia' = 'taller',
  ) {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id: inscripcionId },
      relations: ['usuario', 'taller'],
    });

    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');

    const usuario = inscripcion.usuario;
    const nombreActividad = inscripcion.taller?.nombre || 'Actividad';
    const fecha = new Date().toLocaleDateString('es-GT');

    const carpeta = path.join(process.cwd(), 'public', 'diplomas');
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta, { recursive: true });

    const nombreArchivo = `${usuario.nombre.replace(/ /g, '_')}_${tipo}_${Date.now()}.pdf`;
    const rutaAbsoluta = path.join(carpeta, nombreArchivo);
    const urlRelativa = `/diplomas/${nombreArchivo}`;

    // 🖋 Crear documento PDF real
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(rutaAbsoluta);
    doc.pipe(stream);

    // 🎓 Encabezado
    doc
      .fontSize(26)
      .fillColor('#0d47a1')
      .text('Diploma de ' + (tipo === 'taller' ? 'Participación' : 'Reconocimiento'), {
        align: 'center',
      })
      .moveDown(2);

    // 🧍‍♂️ Nombre del estudiante
    doc
      .fontSize(18)
      .fillColor('black')
      .text(`Otorgado a:`, { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(22)
      .fillColor('#1565c0')
      .text(usuario.nombre, { align: 'center', underline: true })
      .moveDown(1.5);

    // 📚 Actividad
    doc
      .fontSize(16)
      .fillColor('black')
      .text(
        `Por su participación en el ${
          tipo === 'taller' ? 'taller' : 'evento'
        } "${nombreActividad}"`,
        { align: 'center' },
      )
      .moveDown(2);

    // 📅 Fecha y firma
    doc
      .fontSize(12)
      .fillColor('#333')
      .text(`Emitido el ${fecha}`, { align: 'center' })
      .moveDown(5);

    doc
      .fontSize(10)
      .fillColor('#666')
      .text(
        'Congreso de Tecnología — Facultad de Ingeniería en Sistemas\nUniversidad Mariano Gálvez de Guatemala',
        { align: 'center' },
      );

    // ✅ Finalizar el documento correctamente
    doc.end();

    // ⏳ Esperar a que termine de escribirse
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // 💾 Guardar registro en BD
    const diploma = this.diplomaRepo.create({
      inscripcion: { id: inscripcionId },
      tipo,
      urlArchivo: urlRelativa,
    });

    return this.diplomaRepo.save(diploma);
  }

  // 📜 Listar todos los diplomas
  async listar() {
    return this.diplomaRepo.find({
      relations: ['inscripcion', 'inscripcion.usuario', 'inscripcion.taller'],
      order: { id: 'DESC' },
    });
  }

  // 📜 Listar por usuario
  async listarPorUsuario(usuarioId: number) {
    return this.diplomaRepo.find({
      where: { inscripcion: { usuario: { id: usuarioId } } },
      relations: ['inscripcion', 'inscripcion.taller'],
    });
  }

  // 🔍 Obtener uno
  async obtenerUno(id: number) {
    const diploma = await this.diplomaRepo.findOne({
      where: { id },
      relations: ['inscripcion', 'inscripcion.usuario', 'inscripcion.taller'],
    });
    if (!diploma) throw new NotFoundException('Diploma no encontrado');
    return diploma;
  }

  // 📂 Obtener ruta física del PDF
  async obtenerRutaDiploma(id: number) {
    const diploma = await this.diplomaRepo.findOne({
      where: { id },
      relations: ['inscripcion', 'inscripcion.usuario'],
    });
    if (!diploma) throw new NotFoundException('Diploma no encontrado');

    const abs = path.join(process.cwd(), 'public', diploma.urlArchivo.replace(/^\//, ''));
    if (!fs.existsSync(abs)) throw new NotFoundException('El archivo físico no existe');

    return {
      abs,
      rel: diploma.urlArchivo,
      filename: `diploma_${diploma.inscripcion.usuario.nombre.replace(/ /g, '_')}.pdf`,
    };
  }

  // 🗑 Eliminar
  async eliminar(id: number) {
    const diploma = await this.diplomaRepo.findOne({ where: { id } });
    if (!diploma) throw new NotFoundException('Diploma no encontrado');
    await this.diplomaRepo.remove(diploma);
    return { message: 'Diploma eliminado correctamente' };
  }
}
