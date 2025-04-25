import { Injectable } from '@nestjs/common';
import { CreateSaborDto } from './dto/create-sabor.dto';
import { UpdateSaborDto } from './dto/update-sabor.dto';

@Injectable()
export class SaboresService {
  create(createSaborDto: CreateSaborDto) {
    return 'This action adds a new sabore';
  }

  findAll() {
    return `This action returns all sabores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sabore`;
  }

  update(id: number, updateSaborDto: UpdateSaborDto) {
    return `This action updates a #${id} sabore`;
  }

  remove(id: number) {
    return `This action removes a #${id} sabore`;
  }
}
