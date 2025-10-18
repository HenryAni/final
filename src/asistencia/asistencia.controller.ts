import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';

@Controller('asistencia')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

 @Post('registrar')
registrar(@Body() dto: CreateAsistenciaDto) {
  return this.asistenciaService.registrar(dto);
}

  @Get()
  listar() {
    return this.asistenciaService.listar();
  }

    @Get('taller/:id')
  listarPorTaller(@Param('id') id: number) {
    return this.asistenciaService.listarPorTaller(id);
  }

  @Get('usuario/:id')
  listarPorUsuario(@Param('id') id: number) {
    return this.asistenciaService.listarPorUsuario(id);
  }

  @Get('reporte/talleres')
reportePorTaller() {
  return this.asistenciaService.reportePorTaller();
}

}

