import type { Cliente } from './cliente'
import type { Usuario } from './usuario'

// Definir el tipo para los detalles de venta
export interface DetalleVenta {
  cliente: {
    id: number
    nombre: string
    nit: string
    [key: string]: any
  }
}


export interface Venta {
  id: number
  idCliente: number
  cliente: Cliente
  idUsuario: number
  usuario: Usuario
  metodoPago: string
  totalVenta: number
  estado: string
  detalles: DetalleVenta[]
  fechaCreacion: Date
}
