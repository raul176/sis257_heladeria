import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductosService {
  constructor(@InjectRepository(Producto) private productosRepository: Repository<Producto>) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const existe = await this.productosRepository.findOneBy({
      nombre: createProductoDto.nombre.trim(),
      idSabor: createProductoDto.idSabor,
      idProveedor: createProductoDto.idProveedor,
    });

    if (existe) throw new ConflictException('El producto ya existe');

    const producto = new Producto();
    producto.idSabor = createProductoDto.idSabor;
    producto.idProveedor = createProductoDto.idProveedor;
    producto.nombre = createProductoDto.nombre.trim();
    producto.presentacion = createProductoDto.presentacion.trim();
    producto.precio = createProductoDto.precio;
    return this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({
      relations: { proveedores: true, sabores: { productos: true } },
      select: {
        id: true,
        nombre: true,
        presentacion: true,
        precio: true,
        sabores: { id: true, nombre: true, productos: { nombre: true } },
        proveedores: { id: true, razonSocial: true },
      },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: { sabores: true, proveedores: true },
    });

    if (!producto) throw new NotFoundException('El producto no existe');

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return this.productosRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return this.productosRepository.softRemove(producto);
  }
}
