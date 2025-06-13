import { Cliente } from "src/clientes/entities/cliente.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Ventadetalle } from "src/ventadetalles/entities/ventadetalle.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('ventas')
export class Venta {
@PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_ususario' })
  idUsuario: number;
  
  @Column('integer', { name: 'id_cliente'})
  idCliente: number;

  @Column({ type: 'varchar', length: 50 })
  tipoPago: string;

  @Column('decimal')
  montoTotal: number;

  @Column('decimal')
  montoPagado: number;

  @Column('decimal')
  cambio: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Usuario, usuario => usuario.ventas)
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  usuario: Usuario;

  @ManyToOne(() => Cliente, cliente => cliente.venta)
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id' })
  clientes: Cliente;

  @ManyToOne(() => Ventadetalle, ventaDetalle => ventaDetalle.ventas)
  @JoinColumn({ name: 'id_venta_detalle', referencedColumnName: 'id' })
  ventaDetalle: Ventadetalle;
}
