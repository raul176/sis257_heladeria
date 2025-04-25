import { Venta } from "src/ventas/entities/venta.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('empleados')
export class Empleado {
    @PrimaryGeneratedColumn('identity')
    id: number;
  
    @Column({ type: 'varchar', length: 50 })
    nombre: string;
  
    @Column({ type: 'varchar', length: 50 })
    apellido: string;
  
    @Column({ type: 'varchar', length: 30 })
    cargo: string;
  
    @Column({ type: 'varchar', length: 30 })
    telefono: string;
  
    @Column({ type: 'varchar', length: 100 })
    direccion: string;
  
    @CreateDateColumn({ name: 'fecha_contratacion' })
    fechaContratacion: Date;
  
    @ManyToOne(() => Venta, (venta) => venta.empleado)
    venta: Venta;
}
