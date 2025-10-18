import { Taller } from 'src/talleres/entities/taller.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Diploma } from '../../diplomas/entities/diploma.entity';

@Entity()
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.inscripciones, { eager: true })
  usuario: Usuario;

  @ManyToOne(() => Taller, taller => taller.inscripciones, { eager: true })
  taller: Taller;

  @CreateDateColumn()
  fechaInscripcion: Date;

  @OneToMany(() => Diploma, (diploma) => diploma.inscripcion)
diplomas: Diploma[];
}
