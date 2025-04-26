import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @CreateDateColumn({ name: 'fecha_pedido' })
  fecha_pedido: Date;

  @Column({ type: 'varchar', length: 50 })
  tipo_pago: string;

  @Column({ type: 'varchar', length: 50 })
  estado: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedido)
  cliente: Cliente;

  @ManyToOne(() => Empleado, (empleado) => empleado.pedido)
  empleado: Empleado;
}
