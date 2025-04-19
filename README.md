# sis257_heladeria
# 🍦 heladeria ICE
Bienvenido al repositorio oficial del sistema de gestión para la heladería ICE .
Este proyecto tiene como objetivo digitalizar los procesos internos del negocio, permitiendo un mejor control de productos, ventas, clientes y personal.

🧊 Descripción del negocio
La heladería ICE es un emprendimiento local dedicado a la venta de helados artesanales. Ofrecemos una variedad de sabores frutales y promociones para nuestros clientes.

🧩 Entidades del Sistema 

### 🧁 producto ###
- `id_producto (PK)`
- `id_sabor (FK)`
- `nombre`
- `precio`

### 👨‍🍳 empleado ###
- `id_empleado (PK)`
- `nombre`
- `apellido`
- `cargo`
- `fecha_contrataciòn`
- `teléfono`
- `direcciòn`

### 🚚 proveedor ###
- `id_proveedor (PK)`
- `nombre`
- `teléfono`
- `tipo_producto`

### 🍓 sabor ###
- `id_sabor (PK)`
- `nombre`

### 💰 venta ###
- `id_venta (PK)`
- `id_empleado (FK)`
- `id_cliente(FK)`
- `fecha`
- `total`

### 📦 venta_detalle ###
- `id_detalle (PK)`
- `id_venta (FK)`
- `id_producto (FK)`
- `cantidad`
- `precio_unitario`
- `total`

### 🎁 promocion ###
- `id_promocion (PK)`
- `id_producto (FK)`
- `nombre`
- `descuento`
- `fecha_inicio`
- `fecha_fin`

### 👤 cliente ###
- `id_cliente (PK)`
- `nombre`
- `teléfono`
- `direcciòn`

### 🛒 pedido ###
- `id_pedido (PK)`
- `id_cliente (FK)`
- `id_empleado (FK)`
- `fecha_pedido`
- `tipo_pago`
- `estado`
