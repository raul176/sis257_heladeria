import { Producto } from 'src/productos/entities/producto.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  descuento: number;

  @CreateDateColumn({ name: 'fecha_inicio' })
  fechaInicio: Date;

  @CreateDateColumn({ name: 'fecha_fin' })
  fechaFin: Date;

  @ManyToOne(() => Producto, (producto) => producto.promocion)
  producto: Producto;
}
