import { Resultado } from 'src/resultados/entities/resultado.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('competencias')
export class Competencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column({ type: 'timestamp' })
  fechaInicio: Date;

  @Column({ type: 'timestamp' })
  fechaFin: Date;

  @Column()
  lugar: string;

  // Relación con el usuario ganador (para diploma)
  @ManyToOne(() => Usuario, { nullable: true })
  ganador?: Usuario;

  // Relación con resultados (1 competencia → muchos resultados)
  @OneToMany(() => Resultado, (resultado) => resultado.competencia)
  resultados: Resultado[];
}
