import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('sabores')
export class Sabor {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 50 })
    nombre: string;
    
    @ManyToOne(() => Producto, (producto) => producto.sabor)
    producto: Producto;
}
