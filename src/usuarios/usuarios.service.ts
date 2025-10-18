import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { TipoUsuario, Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  // 🟢 Crear usuario
  async crearUsuario(dto: CreateUsuarioDto): Promise<Usuario> {
    const correo = dto.correo.toLowerCase();

    // Validar dominio permitido
    if (correo.endsWith('@miumg.edu.gt')) {
      dto.tipo = TipoUsuario.INTERNO;
    } else if (correo.endsWith('@gmail.com')) {
      dto.tipo = TipoUsuario.EXTERNO;
    } else {
      throw new BadRequestException(
        'Solo se permiten correos internos (@miumg.edu.gt) o externos (@gmail.com)',
      );
    }

    // Validar correo duplicado
    const usuarioExistente = await this.usuariosRepository.findOne({
      where: { correo: dto.correo },
    });
    if (usuarioExistente) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Generar QR único
    const qrCodigo = uuidv4();

    const usuario = this.usuariosRepository.create({
      ...dto,
      qrCodigo,
      password: passwordHash,
    });

    return this.usuariosRepository.save(usuario);
  }

  // 🔹 Listar usuarios
  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  // 🔹 Listar por tipo (interno / externo)
  async obtenerUsuariosPorTipo(tipo?: TipoUsuario): Promise<Usuario[]> {
    if (tipo) {
      return this.usuariosRepository.find({ where: { tipo } });
    }
    return this.usuariosRepository.find();
  }

  // 🔹 Obtener usuario por ID
  async obtenerPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  // 🟣 Actualizar rol (solo para admin)
  async actualizarRol(id: number, nuevoRol: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (!['admin', 'usuario'].includes(nuevoRol)) {
      throw new BadRequestException('Rol no válido. Solo se permite "admin" o "usuario"');
    }

    usuario.rol = nuevoRol;
    return this.usuariosRepository.save(usuario);
  }
}
