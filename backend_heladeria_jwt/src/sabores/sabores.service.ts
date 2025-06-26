import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaborDto } from './dto/create-sabor.dto';
import { UpdateSaborDto } from './dto/update-sabor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sabor } from './entities/sabor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SaboresService {
  constructor(@InjectRepository(Sabor) private saboresRepository: Repository<Sabor>) {}

  async create(createSaborDto: CreateSaborDto): Promise<Sabor> {
    const existe = await this.saboresRepository.findOneBy({
      nombre: createSaborDto.nombre.trim(),
    });

    if (existe) throw new ConflictException('El sabor ya existe');

    const sabor = new Sabor();
    sabor.nombre = createSaborDto.nombre.trim();
    sabor.descripcion = createSaborDto.descripcion?.trim();
    return this.saboresRepository.save(sabor);
  }

  async findAll() {
    return this.saboresRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Sabor> {
    const sabor = await this.saboresRepository.findOneBy({ id });
    if (!sabor) throw new NotFoundException('El sabor no existe');
    return sabor;
  }

  async update(id: number, updateSaborDto: UpdateSaborDto) {
    const sabor = await this.findOne(id);
    const saborUpdate = Object.assign(sabor, updateSaborDto);
    return this.saboresRepository.save(saborUpdate);
  }

  async remove(id: number) {
    const sabor = await this.findOne(id);
    if (sabor) return this.saboresRepository.softRemove(sabor);
  }
}
