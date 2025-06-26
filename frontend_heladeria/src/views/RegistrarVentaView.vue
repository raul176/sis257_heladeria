<template>
  <div class="pos-container">
    <div class="pos-layout">
      <!-- Panel izquierdo - Productos -->
      <div class="products-panel">
        <div class="products-header">
          <div class="search-section">
            <div class="p-input-icon-left search-input">
              <i class="pi pi-search"></i>
              <InputText v-model="busquedaProducto" placeholder="Buscar productos..." class="w-full" />
            </div>
          </div>
        </div>

        <div class="products-grid" style="max-height: 600px; overflow-y: auto; overflow-x: hidden;">
          <div v-for="producto in productosFiltrados" :key="producto.id" class="product-card"
            :class="{ 'out-of-stock': producto.stock <= 0 }" @click="seleccionarProducto(producto)">
            <div class="product-image">
              <i class="pi pi-star product-icon"></i>
            </div>
            <div class="product-info">
                <div class="product-details" style="display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between;">
                  <h3 class="product-name">{{ producto.nombre }}</h3>
                  <span class="product-price" style="font-size: 1.2rem; font-weight: bold; color: #00bcd4;">
                  {{ producto.precio }} Bs
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span class="product-flavor">{{ producto.sabores.nombre }}</span>
                  <span class="product-stock"
                  :class="{ 'low-stock': producto.stock <= 5, 'no-stock': producto.stock <= 0 }">
                  Stock: {{ producto.stock }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel derecho - Carrito y checkout -->
      <div class="checkout-panel">
        <!-- Selección de cliente y cajero -->
        <div class="customer-section">
          <div class="customer-header">
            <h3>
              <i class="pi pi-user"></i>
              Cliente
            </h3>
            <Button icon="pi pi-sign-out" class="p-button-text p-button-lg" @click="cancelar"
              v-tooltip.top="'Salir del registro de venta'" />
            <Button icon="pi pi-user-plus" class="p-button-text p-button-lg" @click="abrirModalCliente"
              v-tooltip.top="'Crear un nuevo cliente'" />
          </div>
          <Select v-model="ventaForm.clienteId" :options="clientesFiltrados" optionLabel="nombre" optionValue="id"
            placeholder="Seleccionar cliente" class="w-full customer-select" filter filterPlaceholder="Buscar...">
            <template #option="slotProps">
              <div class="customer-option">
                <i class="pi pi-user"></i>
                <span>{{ slotProps.option.nombre }}</span>
              </div>
            </template>
          </Select>
        </div>

        <!-- Carrito de compras -->
        <div class="cart-section">
          <div class="cart-header">
            <h3>
              <i class="pi pi-shopping-cart"></i>
              Carrito ({{ detallesVenta.length }})
            </h3>
            <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="limpiarCarrito"
              v-if="detallesVenta.length > 0" v-tooltip.left="'Limpiar carrito'" />
          </div>

          <div class="cart-items" v-if="detallesVenta.length > 0" style="max-height: 200px; overflow-y: auto;">
            <div v-for="(item, index) in detallesVenta" :key="index" class="cart-item">
              <div class="item-info">
                <h4 class="item-name">{{ item.producto.nombre }}</h4>
                <div class="item-price">{{ item.producto.precio }} Bs c/u</div>
              </div>
              <div class="item-controls">
                <div class="quantity-controls">
                  <Button icon="pi pi-minus" class="p-button-sm p-button-text quantity-btn"
                    @click="decrementarCantidad(index)" :disabled="item.cantidad <= 1" />
                  <span class="quantity">{{ item.cantidad }}</span>
                  <Button icon="pi pi-plus" class="p-button-sm p-button-text quantity-btn"
                    @click="incrementarCantidad(index)" :disabled="item.cantidad >= item.producto.stock" />
                </div>
                <div class="item-total">{{ (item.cantidad * item.producto.precio).toFixed(2) }} Bs</div>
                <Button icon="pi pi-times" class="p-button-sm p-button-text p-button-danger remove-btn"
                  @click="eliminarProducto(index)" />
              </div>
            </div>
          </div>

          <div class="cart-empty" v-else>
            <i class="pi pi-shopping-cart empty-icon"></i>
            <p>Carrito vacío</p>
            <small>Selecciona productos para agregar</small>
          </div>
        </div>

        <!-- Totales y pago -->
        <div class="payment-section" v-if="detallesVenta.length > 0">
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span class="amount">{{ totalVenta.toFixed(2) }} Bs</span>
            </div>
            <div class="total-row main-total">
              <span>Total:</span>
              <span class="amount">{{ totalVenta.toFixed(2) }} Bs</span>
            </div>
          </div>

          <div class="payment-input">
            <label>Pago recibido</label>
            <div class="payment-field">
              <InputNumber v-model="pagoCliente" :min="totalVenta" mode="decimal" :step="0.01" class="w-full"
                placeholder="0.00" />
            </div>
          </div>

          <div class="change-display" v-if="pagoCliente && pagoCliente >= totalVenta">
            <div class="change-row">
              <span>Cambio:</span>
              <span class="change-amount">{{ cambio.toFixed(2) }} Bs</span>
            </div>
          </div>

          <div class="checkout-actions">
            <Button label="Procesar Venta" icon="pi pi-check" class="p-button-lg checkout-btn" @click="guardarVenta"
              :loading="submitting" :disabled="!puedeCompletarVenta" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de cantidad rápida usando el nuevo componente -->
    <QuantityModal v-model:visible="mostrarModalCantidad" :product="productoTemporal" :cart-items="detallesVenta"
      @confirm="agregarProductoAlCarrito" @close="cerrarModalCantidad" />

    <!-- Modal de Cliente -->
    <ClienteCreate :visible="mostrarModalCliente" @close="mostrarModalCliente = false" @save="nuevoClienteAgregado"
      @update:visible="mostrarModalCliente = $event" />

    <!-- Modal de Venta Exitosa -->
    <VentaExitosaModal v-if="mostrarModalExito" @otra-venta="onOtraVenta" @ir-ventas="onIrVentas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import http from '../plugins/axios'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import type { DetalleVenta } from '@/models/venta'
import ClienteCreate from '../components/cliente/ClienteCreate.vue'
import QuantityModal from '../components/venta/QuantityModal.vue'
import VentaExitosaModal from '../components/venta/VentaExitosaModal.vue'
import { useAuthStore } from '@/stores'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore();
const usuarioId = authStore.userId || null;
console.log('Usuario ID:', usuarioId);

// Datos para los selects
type Cliente = { id: number; nombre: string; }
type Usuario = { id: number; usuario: string; }

const pagoCliente = ref<number | null>(null)
const clientes = ref<Cliente[]>([])
const usuarios = ref<Usuario[]>([])
const productos = ref<any[]>([])

// Filtros y categorías
const busquedaCliente = ref('')
const busquedaProducto = ref('')

// Modal de cliente y cantidad
const mostrarModalCliente = ref(false)
const mostrarModalCantidad = ref(false)
const productoTemporal = ref(null)

// Modal de venta exitosa
const mostrarModalExito = ref(false)

// Formulario de venta
const ventaForm = ref({
  clienteId: null,
  usuarioId: usuarioId,
  metodoPago: 'efectivo',
  detalles: []
})

// Tabla de productos seleccionados
const detallesVenta = ref<DetalleVenta[]>([])
const submitting = ref(false)

// Total de la venta
const totalVenta = computed(() => {
  return detallesVenta.value.reduce((total, item) => {
    return total + (item.cantidad * item.producto.precio)
  }, 0)
})

const cambio = computed(() => {
  if (pagoCliente.value === null) return 0
  return Math.max(0, pagoCliente.value - totalVenta.value)
})

const puedeCompletarVenta = computed(() => {
  return ventaForm.value.clienteId &&
    ventaForm.value.usuarioId &&
    detallesVenta.value.length > 0 &&
    pagoCliente.value &&
    pagoCliente.value >= totalVenta.value
})

// Filtros computados
const clientesFiltrados = computed(() => {
  if (!busquedaCliente.value) return clientes.value
  return clientes.value.filter(cliente =>
    `${cliente.nombre}`.toLowerCase().includes(busquedaCliente.value.toLowerCase())
  )
})

const productosFiltrados = computed(() => {
  let filtrados = productos.value as any[]

  if (busquedaProducto.value) {
    filtrados = filtrados.filter((producto: any) =>
      producto.nombre.toLowerCase().includes(busquedaProducto.value.toLowerCase())
    )
  }

  return filtrados
})

// Cargar datos iniciales
async function cargarDatos() {
  try {
    const [clientesResp, usuariosResp, productosResp] = await Promise.all([
      http.get('clientes'),
      http.get('usuarios'),
      http.get('productos'),
    ])

    clientes.value = clientesResp.data
    usuarios.value = usuariosResp.data
    productos.value = productosResp.data
    console.log('Datos cargados:', {
      clientes: clientes.value,
      usuarios: usuarios.value,
      productos: productos.value
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los datos necesarios',
      life: 3000
    })
  }
}

// Seleccionar producto
function seleccionarProducto(producto: any) {
  if (producto.stock <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Producto agotado',
      detail: 'Este producto no tiene stock disponible',
      life: 3000
    })
    return
  }

  productoTemporal.value = producto
  mostrarModalCantidad.value = true
}

// Agregar producto al carrito (nueva función que maneja la confirmación del modal)
function agregarProductoAlCarrito(producto: any, cantidad: number) {
  const productoIndex = detallesVenta.value.findIndex(
    item => item.producto.id === producto.id
  )

  if (productoIndex >= 0) {
    detallesVenta.value[productoIndex].cantidad += cantidad
  } else {
    detallesVenta.value.push({
      producto: producto,
      cantidad: cantidad,
      precioUnitario: producto.precio
    })
  }

  toast.add({
    severity: 'success',
    summary: 'Producto agregado',
    detail: 'El producto se agregó al carrito',
    life: 2000
  })
}

// Cerrar modal de cantidad
function cerrarModalCantidad() {
  productoTemporal.value = null
}

// Controles de cantidad en el carrito
function incrementarCantidad(index: number) {
  const item = detallesVenta.value[index]
  if (item.cantidad < item.producto.stock) {
    item.cantidad++
  }
}

function decrementarCantidad(index: number) {
  const item = detallesVenta.value[index]
  if (item.cantidad > 1) {
    item.cantidad--
  }
}

// Eliminar producto del carrito
function eliminarProducto(index: number) {
  detallesVenta.value.splice(index, 1)
}

// Limpiar carrito
function limpiarCarrito() {
  detallesVenta.value = []
  pagoCliente.value = null
}

// Manejar nuevo cliente
function nuevoClienteAgregado(nuevoCliente: any) {
  http.get('clientes').then(resp => {
    clientes.value = resp.data
    const maxIdCliente = clientes.value.reduce((max, c) => c.id > max ? c.id : max, 0)
    ventaForm.value.clienteId = maxIdCliente as any
  })
  mostrarModalCliente.value = false
  toast.add({
    severity: 'success',
    summary: 'Éxito',
    detail: 'Cliente creado y seleccionado correctamente',
    life: 3000
  })
}

function abrirModalCliente() {
  mostrarModalCliente.value = true
}

// Limpiar formulario de venta
function limpiarFormularioVenta() {
  ventaForm.value.clienteId = null
  ventaForm.value.usuarioId = usuarioId
  detallesVenta.value = []
  pagoCliente.value = null
}

// Guardar venta
async function guardarVenta() {
  if (!puedeCompletarVenta.value) return

  submitting.value = true

  try {
    const ventaData = {
      idCliente: ventaForm.value.clienteId,
      idUsuario: Number(ventaForm.value.usuarioId),
      metodoPago: 'efectivo',
      montoPagado: pagoCliente.value,
      cambio: cambio.value,
      detalles: detallesVenta.value.map(item => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad
      }))
    }

    await http.post('ventas', ventaData)

    toast.add({
      severity: 'success',
      summary: 'Venta procesada',
      detail: 'La venta se registró correctamente',
      life: 1000
    })
    mostrarModalExito.value = true
    limpiarFormularioVenta()
    // Ya no redirige aquí, lo hace el modal
  } catch (error) {
    let detailMessage = 'No se pudo procesar la venta'
    const err = error as { response?: { data?: { message?: string } } }
    if (err.response && err.response.data?.message) {
      detailMessage = err.response.data.message
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: detailMessage,
      life: 3000
    })
  } finally {
    submitting.value = false
  }
}

function onOtraVenta() {
  mostrarModalExito.value = false
  limpiarFormularioVenta()
}
function onIrVentas() {
  mostrarModalExito.value = false
  router.push('/ventas')
}

function cancelar() {
  router.push('/ventas')
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.pos-container {
  background: #f8fafc;
  min-height: 100vh;
  padding: 32px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Nunito', 'Segoe UI', Arial, sans-serif;
}

.pos-layout {
  display: flex;
  gap: 32px;
  width: 1200px;
  min-width: 90vw;
}

.products-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.07);
  padding: 24px 18px;
  width: 420px;
  min-width: 72%;
  display: flex;
  flex-direction: column;
}

.products-header {
  margin-bottom: 18px;
}

.search-section {
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 8px;
}

.product-card {
  background: #f0f4ff;
  border-radius: 14px;
  padding: 14px 12px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 2px solid transparent;
  margin: 4px;
}

.product-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.10);
  border-color: #aee6f9;
  transform: translateY(-2px) scale(1.02);
}

.product-card.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f8d7da;
  border-color: #f5c2c7;
}

.product-image {
  background: #e0f7fa;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-icon {
  font-size: 2rem;
  color: #00bcd4;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #3b3b3b;
}

.product-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

.product-price {
  color: #00bcd4;
  font-weight: 600;
}

.product-stock {
  font-size: 0.92em;
  color: #28a745;
}

.product-stock.low-stock {
  color: #ff9800;
  font-weight: 700;
}

.product-stock.no-stock {
  color: #e53935;
  font-weight: 700;
}

.checkout-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.07);
  padding: 24px 18px;
  width: 420px;
  min-width: 30%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.customer-section {
  margin-bottom: 18px;
}

.customer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.customer-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #00bcd4;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.customer-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-select {
  margin-bottom: 10px;
}

.cashier-section label {
  font-size: 0.98em;
  color: #888;
  margin-bottom: 2px;
  display: block;
}

.cart-section {
  background: #f6faff;
  border-radius: 12px;
  padding: 14px 10px;
  margin-bottom: 10px;
  min-height: 120px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.cart-header h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #3b3b3b;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 8px;
  padding: 8px 10px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 2px 0;
}

.item-price {
  font-size: 0.95em;
  color: #00bcd4;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.quantity-btn {
  background: #e0f7fa !important;
  color: #00bcd4 !important;
  border-radius: 50% !important;
  width: 28px !important;
  height: 28px !important;
  font-size: 1.1em !important;
}

.quantity {
  font-size: 1.05em;
  font-weight: 600;
  width: 24px;
  text-align: center;
}

.item-total {
  font-size: 1em;
  font-weight: 600;
  color: #43a047;
  min-width: 70px;
  text-align: right;
}

.remove-btn {
  color: #e53935 !important;
}

.cart-empty {
  text-align: center;
  color: #b0bec5;
  padding: 18px 0 8px 0;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 6px;
  color: #b0bec5;
}

.payment-section {
  background: #e0f7fa;
  border-radius: 12px;
  padding: 16px 12px;
  margin-top: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
}

.totals {
  margin-bottom: 10px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.05em;
  margin-bottom: 4px;
}

.main-total {
  font-size: 1.15em;
  font-weight: 700;
  color: #00bcd4;
}

.amount {
  font-weight: 700;
}

.payment-input label {
  font-size: 0.98em;
  color: #888;
  margin-bottom: 2px;
  display: block;
}

.payment-field {
  margin-bottom: 8px;
}

.change-display {
  margin: 8px 0;
  background: #fffde7;
  border-radius: 8px;
  padding: 8px 10px;
  color: #fbc02d;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.change-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.change-amount {
  color: #43a047;
  font-size: 1.1em;
  font-weight: 700;
}

.checkout-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.checkout-btn {
  background: linear-gradient(90deg, #00bcd4 0%, #43e97b 100%);
  color: #fff;
  border: none;
  font-size: 1.1em;
  font-weight: 700;
  border-radius: 8px;
  padding: 10px 24px;
  box-shadow: 0 2px 8px 0 rgba(0, 188, 212, 0.10);
  transition: background 0.2s;
}

.checkout-btn:disabled {
  background: #b2ebf2;
  color: #fff;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .pos-layout {
    flex-direction: column;
    width: 98vw;
    gap: 18px;
  }

  .products-panel,
  .checkout-panel {
    width: 100%;
    min-width: unset;
  }
}
</style>