import { Controller, Get, NotFoundException, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import { DiplomasService } from './diplomas.service';

@Controller('diplomas')
export class DiplomasController {
  constructor(private readonly diplomasService: DiplomasService) {}

  // Generar y enviar por correo
  @Post('generar/:inscripcionId')
  generar(@Param('inscripcionId') inscripcionId: number) {
    return this.diplomasService.generarDiploma(Number(inscripcionId));
  }

  // Listar todos los diplomas
  @Get()
  listar() {
    return this.diplomasService.listar();
  }

  // Listar diplomas de un usuario
  @Get('usuario/:usuarioId')
  listarPorUsuario(@Param('usuarioId') usuarioId: number) {
    return this.diplomasService.listarPorUsuario(Number(usuarioId));
  }




  // Descargar un diploma por id
  @Get(':id/download')
  async download(@Param('id') id: number, @Res() res: Response) {
    try {
      console.log(`Intentando descargar diploma con ID: ${id}`);
      const { abs, filename } = await this.diplomasService.obtenerRutaDiploma(Number(id));
      
      console.log(`Ruta absoluta del diploma: ${abs}`);
      console.log(`Nombre del archivo: ${filename}`);
      
      if (!fs.existsSync(abs)) {
        console.error(`Archivo no encontrado en: ${abs}`);
        throw new NotFoundException(`Archivo del diploma no encontrado en el sistema`);
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      const stream = fs.createReadStream(abs);
      
      stream.on('error', (error) => {
        console.error(`Error al leer el archivo: ${error.message}`);
        if (!res.headersSent) {
          res.status(500).json({ 
            message: 'Error al leer el archivo del diploma',
            error: error.message 
          });
        }
      });
      
      stream.pipe(res);
    } catch (error) {
      console.error(`Error en la descarga del diploma: ${error.message}`);
      if (error instanceof NotFoundException) {
        res.status(404).json({ 
          message: error.message,
          details: 'El diploma solicitado no existe o no se puede encontrar'
        });
      } else {
        res.status(500).json({ 
          message: 'Error interno del servidor',
          details: error.message
        });
    }
  }
}
}
