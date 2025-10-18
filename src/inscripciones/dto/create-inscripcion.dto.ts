import { IsInt } from 'class-validator';

export class CreateInscripcionDto {
  @IsInt()
  usuarioId: number;

  @IsInt()
  tallerId: number;
}
