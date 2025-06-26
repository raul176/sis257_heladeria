import type { Proveedor } from './proveedor';
import type { Sabor } from './sabor';
export interface Producto {
  id: number
  nombre: string
  presentacion: string
  precio: number
  stock: number
  idProveedor: number | null
  idSabor: number | null
  proveedores: Proveedor
  sabores: Sabor
}
