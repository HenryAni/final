import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Asistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inscripcion, { eager: true })
  inscripcion: Inscripcion;

  @CreateDateColumn()
  fechaRegistro: Date;
}
