import { Producto } from "src/productos/entities/producto.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('ventaDetalle')
export class Ventadetalle {
    @PrimaryGeneratedColumn('identity')
    id: number;
    
    @Column('integer', { name: 'id_venta' })
    idVenta: number;
      
    @Column('integer', { name: 'id_producto'})
    idProducto: number;

    @Column('decimal')
    cantidad: number;
      
    @Column('decimal')
    precioUnitario: number;
    
    @CreateDateColumn({ name: 'fecha_creacion' })
    fechaCreacion: Date;
    
    @UpdateDateColumn({ name: 'fecha_modificacion' })
    fechaModificacion: Date;
    
    @DeleteDateColumn({ name: 'fecha_eliminacion' })
    fechaEliminacion: Date;
    
    @ManyToOne(() => Venta, venta => venta.ventaDetalle)
    @JoinColumn({ name: 'id_venta', referencedColumnName: 'id' })
    ventas: Venta;

    @ManyToOne(() => Producto, producto => producto.ventaDetalle)
    @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
    productos: Producto;
}
