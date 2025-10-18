import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { TipoUsuario, Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // 🟢 Registro público (cualquier usuario)
  @Public()
  @Post('registrar')
  async registrar(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.crearUsuario(dto);
  }

  // 🔒 Listar usuarios (solo admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async listar(@Query('tipo') tipo?: TipoUsuario): Promise<Usuario[]> {
    return this.usuariosService.obtenerUsuariosPorTipo(tipo);
  }

  // 🔒 Obtener usuario por ID (admin o el mismo usuario)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  obtenerUno(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuariosService.obtenerPorId(id);
  }

  // 🟣 Actualizar rol (solo admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/rol')
  async actualizarRol(
    @Param('id', ParseIntPipe) id: number,
    @Body('rol') rol: string,
  ): Promise<Usuario> {
    return this.usuariosService.actualizarRol(id, rol);
  }
}
