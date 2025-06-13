import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VentadetallesService } from './ventadetalles.service';
import { CreateVentadetalleDto } from './dto/create-ventadetalle.dto';
import { UpdateVentadetalleDto } from './dto/update-ventadetalle.dto';

@Controller('ventadetalles')
export class VentadetallesController {
  constructor(private readonly ventadetallesService: VentadetallesService) {}

  @Post()
  create(@Body() createVentadetalleDto: CreateVentadetalleDto) {
    return this.ventadetallesService.create(createVentadetalleDto);
  }

  @Get()
  findAll() {
    return this.ventadetallesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventadetallesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentadetalleDto: UpdateVentadetalleDto) {
    return this.ventadetallesService.update(+id, updateVentadetalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventadetallesService.remove(+id);
  }
}
