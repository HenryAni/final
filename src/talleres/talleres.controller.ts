import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateTallerDto } from './dto/create-taller.dto';
import { UpdateTallerDto } from './dto/update-taller.dto';
import { Taller } from './entities/taller.entity';
import { TalleresService } from './talleres.service';

@Controller('talleres')
export class TalleresController {
  constructor(private readonly talleresService: TalleresService) {}

  // Solo admin puede crear talleres
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateTallerDto): Promise<Taller> {
    return this.talleresService.create(dto);
  }

  // Libre para todos (autenticados o no, depende de tu decisión)
  @Get()
  findAll(): Promise<Taller[]> {
    return this.talleresService.findAll();
  }

  // Libre para todos (consultar un taller específico)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Taller> {
    return this.talleresService.findOne(id);
  }

  // Solo admin puede actualizar talleres
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTallerDto,
  ): Promise<Taller> {
    return this.talleresService.update(id, dto);
  }

  // Solo admin puede eliminar talleres
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ deleted: true }> {
    await this.talleresService.remove(id);
    return { deleted: true };
  }
}
