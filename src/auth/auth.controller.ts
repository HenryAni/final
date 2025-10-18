import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
    @Post('login')
  async login(@Body() body: LoginDto) {
    const usuario = await this.authService.validateUser(body.correo, body.password);
    return this.authService.login(usuario);
  }
}

