<!-- <script setup lang="ts">
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';
import http from '../../plugins/axios';

const props = defineProps<{
  visible: boolean
  ventaId: number | null
}>()


const emit = defineEmits(['close', 'update:visible'])
const toast = useToast()
const detalles = ref<any[]>([])
const cliente = ref<{nombre: string; nit: string} | null>(null)
const loading = ref<boolean>(false)
const totalVenta = ref<number>(0)

async function cargarDetalles() {
  if (!props.ventaId) return

  loading.value = true
  try {
    const response = await http.get(`ventas/${props.ventaId}/detalles`)
    detalles.value = response.data.detalles
    cliente.value = response.data.cliente

    // Calcular el total de la venta sumando todos los subtotales
    totalVenta.value = detalles.value.reduce((total, detalle) =>
      total + parseFloat(detalle.subtotal), 0)

    console.log('Detalles obtenidos:', detalles.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron obtener los detalles de la venta',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

function cerrarModal() {
  emit('update:visible', false)
  emit('close')
}

// Cargar detalles solo una vez cuando el modal se abre con un ID válido
watch(
  [() => props.visible, () => props.ventaId],
  ([visible, ventaId], [oldVisible, oldVentaId]) => {
    if (visible && ventaId && (!oldVisible || ventaId !== oldVentaId)) {
      cargarDetalles()
    }
  }
)

defineExpose({ cargarDetalles })
</script>

<template>
  <Dialog :visible="visible" header="Detalles de Venta" :style="{ width: '90vw', maxWidth: '1000px' }" :modal="true"
    @hide="cerrarModal" @update:visible="(val) => emit('update:visible', val)">
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Cargando detalles...</p>
    </div>

    <div v-else class="detalles-container">
      <div class="header-info">
        <h3>Venta #{{ ventaId }}</h3>
        <div class="total-box">
          <span>Total de la venta:</span>
          <span class="total-amount">{{ totalVenta.toFixed(2) }} Bs</span>
        </div>
      </div>

      <div class="table-responsive">
        <table class="detalles-table">
          <thead>
            <tr>
              <th class="th-number">No.</th>
               <th>Cliente</th>
              <th>NIT-Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detalle, index) in detalles" :key="detalle.id">
              <td class="td-number">{{ index + 1 }}</td>
              <td>{{ detalle.cliente?.nombre || '-' }}</td>
              <td>{{ detalle.cliente?.nit || '-' }}</td>
              <td>{{ detalle.producto?.nombre || '-' }}</td>
              <td class="td-number">{{ detalle.cantidad }}</td>
              <td class="td-number">{{ detalle.precioUnitario }} Bs</td>
              <td class="td-number">{{ detalle.subtotal }} Bs</td>
              <td>
              {{
                detalle.fechaCreacion
                  ? new Date(detalle.fechaCreacion).toLocaleString()
                  : '-'
              }}
            </td>
            </tr>
            <tr v-if="detalles.length === 0" class="empty-row">
              <td colspan="6">No hay detalles disponibles para esta venta</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.detalles-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #ffe5ec;
  /* Fondo rosado claro */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: #ffb3c1;
  /* Fondo rosado */
  padding: 10px;
  border-radius: 6px;
  color: #fff;
}

.header-info h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.total-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color : #d81b60;
  background-color: #ffc2d1;
  /* Fondo rosado más oscuro */
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.total-amount {
  font-weight: 700;
  color: #d81b60;
  /* Texto frambuesa oscuro */
  font-size: 1.1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: #d81b60;
  /* Texto frambuesa oscuro */
}

.table-responsive {
  overflow-x: auto;
  max-height: 80vh;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.detalles-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  font-size: 0.9rem;
  text-align: center;
}

.detalles-table th {
  background-color: #ffb3c1;
  /* Fondo rosado */
  color: #fff;
  padding: 1rem;
  text-align: center;
  font-weight: 500;
  position: sticky;
  top: 0;
  white-space: nowrap;
}

.th-number {
  width: 50px;
  text-align: center;
}

.detalles-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ffd6e1;
  /* Bordes rosados */
  vertical-align: top;
  line-height: 1.4;
}

.td-number {
  text-align: center;
  font-weight: 500;
}

.detalles-table tr:nth-child(even) {
  background-color: #ffe5ec;
  /* Fondo rosado claro */
}

.detalles-table tr:hover {
  background-color: #ffc2d1;
  /* Fondo rosado más oscuro */
}

.empty-row td {
  text-align: center;
  padding: 2rem;
  color: #d81b60;
  /* Texto frambuesa oscuro */
}

@media (max-width: 768px) {
  .header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .detalles-table th,
  .detalles-table td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}
</style> -->

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';
import http from '../../plugins/axios';

const props = defineProps<{
  visible: boolean
  ventaId: number | null
}>()

const emit = defineEmits(['close', 'update:visible'])
const toast = useToast()
const detalles = ref<any[]>([])
const cliente = ref<{nombre: string; nit: string} | null>(null)
const loading = ref<boolean>(false)
const totalVenta = ref<number>(0)

async function cargarDetalles() {
  if (!props.ventaId) return

  loading.value = true
  try {
    const response = await http.get(`ventas/${props.ventaId}/detalles`)
    detalles.value = response.data.detalles
    cliente.value = response.data.cliente

    totalVenta.value = detalles.value.reduce((total, detalle) =>
      total + parseFloat(detalle.subtotal), 0)

    console.log('Detalles obtenidos:', detalles.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron obtener los detalles de la venta',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

function cerrarModal() {
  emit('update:visible', false)
  emit('close')
}

watch(
  [() => props.visible, () => props.ventaId],
  ([visible, ventaId], [oldVisible, oldVentaId]) => {
    if (visible && ventaId && (!oldVisible || ventaId !== oldVentaId)) {
      cargarDetalles()
    }
  }
)

defineExpose({ cargarDetalles })
</script>

<template>
  <Dialog :visible="visible" header="Detalles de Venta" :style="{ width: '90vw', maxWidth: '1000px' }" :modal="true"
    @hide="cerrarModal" @update:visible="(val) => emit('update:visible', val)">
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Cargando detalles...</p>
    </div>

    <div v-else class="detalles-container">
      <div class="header-info">
        <h3>Venta #{{ ventaId }}</h3>
        <div class="cliente-info">
          <strong>Cliente:</strong> {{ cliente?.nombre || '-' }} <br />
          <strong>NIT:</strong> {{ cliente?.nit || '-' }}
        </div>
        <div class="total-box">
          <span>Total de la venta:</span>
          <span class="total-amount">{{ totalVenta.toFixed(2) }} Bs</span>
        </div>
      </div>

      <div class="table-responsive">
        <table class="detalles-table">
          <thead>
            <tr>
              <th class="th-number">No.</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detalle, index) in detalles" :key="detalle.id">
              <td class="td-number">{{ index + 1 }}</td>
              <td>{{ detalle.producto?.nombre || '-' }}</td>
              <td class="td-number">{{ detalle.cantidad }}</td>
              <td class="td-number">{{ detalle.precioUnitario }} Bs</td>
              <td class="td-number">{{ detalle.subtotal }} Bs</td>
              <td>
                {{
                  detalle.fechaCreacion
                    ? new Date(detalle.fechaCreacion).toLocaleString()
                    : '-'
                }}
              </td>
            </tr>
            <tr v-if="detalles.length === 0" class="empty-row">
              <td colspan="6">No hay detalles disponibles para esta venta</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.detalles-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #ffe5ec;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: #ffb3c1;
  padding: 10px;
  border-radius: 6px;
  color: #fff;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-info h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.cliente-info {
  color: black; /* Aquí se cambia el color a negro */
  font-weight: 500;
  font-size: 1rem;
}

.total-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color : #d81b60;
  background-color: #ffc2d1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.total-amount {
  font-weight: 700;
  color: #d81b60;
  font-size: 1.1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: #d81b60;
}

.table-responsive {
  overflow-x: auto;
  max-height: 80vh;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.detalles-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  font-size: 0.9rem;
  text-align: center;
}

.detalles-table th {
  background-color: #ffb3c1;
  color: #fff;
  padding: 1rem;
  text-align: center;
  font-weight: 500;
  position: sticky;
  top: 0;
  white-space: nowrap;
}

.th-number {
  width: 50px;
  text-align: center;
}

.detalles-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ffd6e1;
  vertical-align: top;
  line-height: 1.4;
}

.td-number {
  text-align: center;
  font-weight: 500;
}

.detalles-table tr:nth-child(even) {
  background-color: #ffe5ec;
}

.detalles-table tr:hover {
  background-color: #ffc2d1;
}

.empty-row td {
  text-align: center;
  padding: 2rem;
  color: #d81b60;
}

@media (max-width: 768px) {
  .header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .detalles-table th,
  .detalles-table td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}
</style>
