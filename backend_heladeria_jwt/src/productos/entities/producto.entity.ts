import { Sabor } from 'src/sabores/entities/sabor.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DetalleVenta } from 'src/ventas/entities/detalle_venta.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_sabor' })
  idSabor: number;

  @Column('integer', { name: 'id_proveedor' })
  idProveedor: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  presentacion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('integer', { default: 0 })
  stock: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Sabor, sabor => sabor.productos)
  @JoinColumn({ name: 'id_sabor', referencedColumnName: 'id' })
  sabores: Sabor;

  @ManyToOne(() => Proveedor, proveedor => proveedor.productos)
  @JoinColumn({ name: 'id_proveedor', referencedColumnName: 'id' })
  proveedores: Proveedor;

  @OneToMany(() => DetalleVenta, ventadetalle => ventadetalle.producto)
  ventadetalles: DetalleVenta[];
}
