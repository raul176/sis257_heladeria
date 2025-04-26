import { Promocion } from 'src/promociones/entities/promocion.entity';
import { Sabor } from 'src/sabores/entities/sabor.entity';
import { Ventadetalle } from 'src/ventadetalles/entities/ventadetalle.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column('decimal')
  precio: number;

  @Column('decimal')
  stock: number;

  @ManyToOne(() => Sabor, (sabor) => sabor.producto)
  sabor: Sabor;

  @ManyToOne(() => Ventadetalle, (ventadetalle) => ventadetalle.producto)
  ventadetalle: Ventadetalle;

  @ManyToOne(() => Promocion, (promocion) => promocion.producto)
  promocion: Promocion;
}
