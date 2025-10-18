import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAsistenciaDto {
  @IsNotEmpty()
  @IsUUID()
  qrCodigo: string;   // el código QR del usuario

  @IsNotEmpty()
  @IsInt()
  tallerId: number;   // el ID del taller donde pasa asistencia
}
