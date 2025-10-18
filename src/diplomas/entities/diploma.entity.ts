import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Competencia } from '../../competencias/entities/competencia.entity';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';

@Entity('diplomas')
export class Diploma {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.diplomas, { eager: true })
  inscripcion: Inscripcion;

  @Column()
  urlArchivo: string; // nombre o ruta del PDF generado

  @CreateDateColumn()
  fechaGeneracion: Date;

  //modificacion si no eliminar
@ManyToOne(() => Competencia, { nullable: true })
competencia: Competencia | null; // 

@Column({ default: 'taller' })
tipo: 'taller' | 'competencia';
}
