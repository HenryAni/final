import { Inscripcion } from 'src/inscripciones//entities/inscripcion.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Taller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  // Fecha/hora de inicio y fin (opcional)
  @Column({ type: 'timestamp', nullable: true })
  fechaInicio?: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaFin?: Date;

  @Column({ type: 'int', default: 0 })
  cupos: number;

  @Column({ nullable: true })
  lugar?: string;

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.taller)
inscripciones: Inscripcion[];
}
