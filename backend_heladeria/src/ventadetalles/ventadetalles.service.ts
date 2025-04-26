import { Injectable } from '@nestjs/common';
import { CreateVentadetalleDto } from './dto/create-ventadetalle.dto';
import { UpdateVentadetalleDto } from './dto/update-ventadetalle.dto';

@Injectable()
export class VentadetallesService {
  create(createVentadetalleDto: CreateVentadetalleDto) {
    return 'This action adds a new ventadetalle';
  }

  findAll() {
    return `This action returns all ventadetalles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ventadetalle`;
  }

  update(id: number, updateVentadetalleDto: UpdateVentadetalleDto) {
    return `This action updates a #${id} ventadetalle`;
  }

  remove(id: number) {
    return `This action removes a #${id} ventadetalle`;
  }
}
