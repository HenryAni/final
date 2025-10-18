import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';
import { ResultadoService } from './resultados.service';

@Controller('resultados')
export class ResultadosController {
  constructor(private readonly resultadoService: ResultadoService) {}

  @Get()
  listar() {
    return this.resultadoService.listar();
  }

  @Get(':id')
  obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.resultadoService.obtenerUno(id);
  }

  // Solo administradores pueden crear, actualizar o eliminar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  crear(@Body() dto: CreateResultadoDto) {
    return this.resultadoService.crear(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateResultadoDto) {
    return this.resultadoService.actualizar(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.resultadoService.eliminar(id);
  }
}
