import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  correo: string;

  @ApiProperty()
  password: string;
}
