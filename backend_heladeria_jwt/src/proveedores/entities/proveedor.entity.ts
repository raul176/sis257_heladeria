import { Producto } from 'src/productos/entities/producto.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'razon_social' })
  razonSocial: string;

  @Column({ type: 'varchar', length: 20 })
  nit: string;

  @Column({ type: 'varchar', length: 50 })
  telefono: string;

  @Column({ type: 'varchar', length: 100, name: 'tipo_producto' })
  tipoProducto: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Producto, producto => producto.proveedores)
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  productos: Producto;
}
