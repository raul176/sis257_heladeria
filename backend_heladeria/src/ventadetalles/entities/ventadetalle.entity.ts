import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ventadetalles')
export class Ventadetalle {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @ManyToOne(() => Venta, (venta) => venta.ventadetalle)
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.ventadetalle)
  producto: Producto;
}
