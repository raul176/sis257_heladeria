import { Empleado } from "src/empleados/entities/empleado.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('ventas')
export class Venta {
    @PrimaryGeneratedColumn('identity')
    id: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;
  
    @ManyToOne(() => Empleado, (empleado) => empleado.venta)
    empleado: Empleado;
}
