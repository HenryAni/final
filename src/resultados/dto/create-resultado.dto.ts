import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateResultadoDto {
  @IsString()
  @IsNotEmpty()
  competencia: string;

  @IsString()
  @IsNotEmpty()
  nombreGanador: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  fotoUrl?: string;

  @IsInt()
  @Min(1)
  puesto: number;

  @IsInt()
  @IsOptional()
  anio?: number;
}
