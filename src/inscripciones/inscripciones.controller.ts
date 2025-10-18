import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { InscripcionesService } from './inscripciones.service';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  crear(@Body() dto: CreateInscripcionDto) {
    return this.inscripcionesService.crear(dto);
  }

  @Get()
  listar() {
    return this.inscripcionesService.listar();
  }

  @Get('taller/:id')
listarPorTaller(@Param('id') id: number) {
  return this.inscripcionesService.listarPorTaller(id);
}

@Get('usuario/:id')
listarPorUsuario(@Param('id') id: number) {
  return this.inscripcionesService.listarPorUsuario(id);
}

@Get('resumen')
resumenPorTaller() {
  return this.inscripcionesService.resumenPorTaller();
}

}

