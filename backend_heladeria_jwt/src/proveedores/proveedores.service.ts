import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(@InjectRepository(Proveedor) private proveedoresRepository: Repository<Proveedor>) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    const existe = await this.proveedoresRepository.findOneBy({
      razonSocial: createProveedorDto.razonSocial.trim(),
    });

    if (existe) throw new ConflictException('El proveedor ya existe');

    const proveedor = new Proveedor();
    proveedor.razonSocial = createProveedorDto.razonSocial.trim();
    proveedor.nit = createProveedorDto.nit.trim();
    proveedor.telefono = createProveedorDto.telefono.trim();
    proveedor.tipoProducto = createProveedorDto.tipoProducto.trim();
    return this.proveedoresRepository.save(proveedor);
  }

  async findAll() {
    return this.proveedoresRepository.find({ order: { razonSocial: 'ASC' } });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOneBy({ id });
    if (!proveedor) throw new NotFoundException('El proveedor no existe');
    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    const proveedor = await this.findOne(id);
    const proveedorUpdate = Object.assign(proveedor, updateProveedorDto);
    return this.proveedoresRepository.save(proveedorUpdate);
  }

  async remove(id: number) {
    const proveedor = await this.findOne(id);
    if (proveedor) return this.proveedoresRepository.softRemove(proveedor);
  }
}

