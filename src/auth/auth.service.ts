import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, password: string): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({ where: { correo } });
    if (usuario && await bcrypt.compare(password, usuario.password)) {
      return usuario;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  async login(usuario: Usuario) {
    const payload = { sub: usuario.id, correo: usuario.correo, rol: usuario.rol };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

