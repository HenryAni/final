import { IsDateString, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateTallerDto {
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string; // ISO string

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  cupos?: number;

  @IsOptional()
  lugar?: string;
}
