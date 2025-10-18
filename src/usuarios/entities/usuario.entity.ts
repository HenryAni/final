import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum TipoUsuario {
  INTERNO = 'interno',
  EXTERNO = 'externo',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  colegio: string;

  @Column({ nullable: true })
  carrera: string;

  @Column({ nullable: true })
  fechaNacimiento: Date;

  @Column({ nullable: true })
  direccion: string;

  @Column({ unique: true })
  qrCodigo: string;

  @Column({ default: false })
  correoConfirmado: boolean;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
  })
  tipo: TipoUsuario;

  @Column()
password: string;  // encriptada con bcrypt

@Column({ default: 'usuario' })
rol: string; // 'usuario' o 'admin'
  
  @OneToMany(() => Inscripcion, inscripcion => inscripcion.usuario)
inscripciones: Inscripcion[];
}
