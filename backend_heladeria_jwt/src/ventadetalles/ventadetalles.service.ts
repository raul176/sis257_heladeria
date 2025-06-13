import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentadetalleDto } from './dto/create-ventadetalle.dto';
import { UpdateVentadetalleDto } from './dto/update-ventadetalle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ventadetalle } from './entities/ventadetalle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentadetallesService {
  constructor(@InjectRepository(Ventadetalle) private ventaDetallesRepository: Repository<Ventadetalle>) {}
  
    async create(createVentadetalleDto: CreateVentadetalleDto): Promise<Ventadetalle> {
      const existe = await this.ventaDetallesRepository.findOneBy({
        cantidad: createVentadetalleDto.cantidad,
        idVenta: createVentadetalleDto.idVenta,
        idProducto: createVentadetalleDto.idProducto,
      });
  
      if (existe) throw new ConflictException('El venta detalle ya existe');
  
      const ventaDetalle = new Ventadetalle();
      ventaDetalle.idVenta = createVentadetalleDto.idVenta;
      ventaDetalle.idProducto = createVentadetalleDto.idProducto;
      ventaDetalle.cantidad= createVentadetalleDto.cantidad;
      ventaDetalle.precioUnitario = createVentadetalleDto.precioUnitario;
      return this.ventaDetallesRepository.save(ventaDetalle);
    }
  
    async findAll(): Promise<Ventadetalle[]> {
      return this.ventaDetallesRepository.find({
        relations: { ventas: true, productos: { ventaDetalle: true } },
        select: {
          id: true,
          cantidad: true,
          precioUnitario: true,
          productos: { id: true, nombre: true, ventaDetalle: { cantidad: true } },
          ventas: { id: true, tipoPago: true },
        },
      });
    }
  
    async findOne(id: number): Promise<Ventadetalle> {
      const ventaDetalle = await this.ventaDetallesRepository.findOne({
        where: { id },
        relations: { productos: true, ventas: true },
      });
  
      if (!ventaDetalle) throw new NotFoundException('El venta detalle no existe');
  
      return ventaDetalle;
    }
  
    async update(id: number, updateVentadetalleDto: UpdateVentadetalleDto): Promise<Ventadetalle> {
      const ventaDetalle = await this.findOne(id);
      Object.assign(ventaDetalle, updateVentadetalleDto);
      return this.ventaDetallesRepository.save(ventaDetalle);
    }
  
    async remove(id: number) {
      const ventaDetalle = await this.findOne(id);
      return this.ventaDetallesRepository.softRemove(ventaDetalle);
    }
}
