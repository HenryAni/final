import { IsDateString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { TipoUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsOptional()
  telefono?: string;

  @IsOptional()
  colegio?: string;

  @IsOptional()
  carrera?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  direccion?: string;

  @IsNotEmpty()
  tipo: TipoUsuario;


  @IsNotEmpty()
  password: string; // encriptada con bcrypt

  @IsOptional()
  rol?: string; // 'usuario' o 'admin', por defecto 'usuario'
}
