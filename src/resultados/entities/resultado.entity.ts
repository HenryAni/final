import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('resultado')
export class Resultado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  competencia: string;

  @Column()
  nombreGanador: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  fotoUrl: string; // URL de la imagen del ganador o proyecto

  @Column()
  puesto: number; // 1°, 2°, 3°

  @CreateDateColumn()
  fechaRegistro: Date;

  @Column({ default: new Date().getFullYear() })
  anio: number;
}
