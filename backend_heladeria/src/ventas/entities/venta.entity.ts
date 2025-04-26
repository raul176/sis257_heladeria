import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Ventadetalle } from 'src/ventadetalles/entities/ventadetalle.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn({ name: 'fecha_venta' })
  fecha: Date;

  @ManyToOne(() => Empleado, (empleado) => empleado.venta)
  empleado: Empleado;

  @ManyToOne(() => Ventadetalle, (ventadetalle) => ventadetalle.venta)
  ventadetalle: Ventadetalle;
}
