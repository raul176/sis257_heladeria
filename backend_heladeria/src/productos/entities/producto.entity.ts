import { Sabor } from "src/sabores/entities/sabor.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn('identity')
    id: number;
    
    @Column({ type: 'varchar', length: 50 })
    nombre: string;
    
    @Column('decimal')
    precio: number;
    
    @ManyToOne(() => Sabor, (sabor) => sabor.producto)
    sabor: Sabor;
}
