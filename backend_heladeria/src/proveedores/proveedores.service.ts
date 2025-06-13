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

    if (existe) throw new ConflictException('El artista ya existe');

    const artista = new Proveedor();
    artista.razonSocial = createProveedorDto.razonSocial.trim();
    artista.nit = createProveedorDto.nit.trim();
    artista.telefono = createProveedorDto.telefono.trim();
    artista.tipoProducto = createProveedorDto.tipoProducto.trim();
    return this.proveedoresRepository.save(artista);
  }

  async findAll() {
    return this.proveedoresRepository.find({ order: { razonSocial: 'ASC' } });
  }

  async findOne(id: number): Promise<Proveedor> {
    const artista = await this.proveedoresRepository.findOneBy({ id });
    if (!artista) throw new NotFoundException('El artista no existe');
    return artista;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    const artista = await this.findOne(id);
    const artistaUpdate = Object.assign(artista, updateProveedorDto);
    return this.proveedoresRepository.save(artistaUpdate);
  }

  async remove(id: number) {
    const artista = await this.findOne(id);
    if (artista) return this.proveedoresRepository.softRemove(artista);
  }
}

