import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentasService {
  constructor(@InjectRepository(Venta) private ventasRepository: Repository<Venta>) {}
  
    async create(createVentaDto: CreateVentaDto): Promise<Venta> {
      const existe = await this.ventasRepository.findOneBy({
        tipoPago: createVentaDto.tipoPago.trim(),
        idUsuario: createVentaDto.idUsuario,
        idCliente: createVentaDto.idCliente,
      });
  
      if (existe) throw new ConflictException('La venta ya existe');
  
      const venta = new Venta();
      venta.idUsuario = createVentaDto.idUsuario;
      venta.idCliente = createVentaDto.idCliente;
      venta.tipoPago = createVentaDto.tipoPago.trim();
      venta.montoTotal = createVentaDto.montoTotal;
      venta.montoPagado = createVentaDto.montoPagado;
      venta.cambio = createVentaDto.cambio;
      return this.ventasRepository.save(venta);
    }
  
    async findAll(): Promise<Venta[]> {
      return this.ventasRepository.find({
        relations: { usuario: true, clientes: { venta: true } },
        select: {
          id: true,
          tipoPago: true,
          montoTotal: true,
          montoPagado: true,
          cambio: true,
          clientes: { id: true, nombre: true, venta: { tipoPago: true } },
          usuario: { id: true, usuario: true },
        },
      });
    }
  
    async findOne(id: number): Promise<Venta> {
      const venta = await this.ventasRepository.findOne({
        where: { id },
        relations: { clientes: true, usuario: true },
      });
  
      if (!venta) throw new NotFoundException('La venta no existe');
  
      return venta;
    }
  
    async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
      const venta = await this.findOne(id);
      Object.assign(venta, updateVentaDto);
      return this.ventasRepository.save(venta);
    }
  
    async remove(id: number) {
      const venta = await this.findOne(id);
      return this.ventasRepository.softRemove(venta);
    }
}
