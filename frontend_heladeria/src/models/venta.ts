import type { Cliente } from "./cliente"
import type { Usuario } from "./usuario"

export interface Venta {
  id: number
  idUsuario: number
  idEmpleado: number
  tipoPago: string
  montoTotal: string
  montoPagado: string
  cambio: string
  usuario: Usuario
  cliente: Cliente
}
