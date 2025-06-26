<script setup lang="ts">
import type { Producto } from '@/models/producto'
import http from '@/plugins/axios'
import { Card, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'productos'
const productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])
const productoDelete = ref<Producto | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

// Paginación
const paginaActual = ref<number>(1)
const elementosPorPagina = ref<number>(5)

async function obtenerLista() {
  productos.value = await http.get(ENDPOINT).then((response) => response.data)
}

const productosFiltrados = computed(() => {
  const productosFiltradosPorBusqueda = productos.value.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
  const inicio = (paginaActual.value - 1) * elementosPorPagina.value
  const fin = inicio + elementosPorPagina.value
  return productosFiltradosPorBusqueda.slice(inicio, fin)
})

const totalPaginas = computed(() => {
  const productosFiltradosPorBusqueda = productos.value.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
  return Math.ceil(productosFiltradosPorBusqueda.length / elementosPorPagina.value)
})

function cambiarPagina(nuevaPagina: number) {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
  }
}

function emitirEdicion(producto: Producto) {
  emit('edit', {
    ...producto,
    idProveedor: producto.proveedores?.id,
    idSabor: producto.sabores?.id
  })
}

function mostrarEliminarConfirm(producto: Producto) {
  productoDelete.value = producto
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${productoDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div class="producto-list-container">
    <div class="search-bar">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por nombre" />
      </InputGroup>
    </div>
    <div class="table-container">
      <table class="producto-table">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Nombre</th>
            <th>Presentación</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Sabor</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
            <td>{{ (paginaActual - 1) * elementosPorPagina + index + 1 }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.presentacion }}</td>
            <td>{{ producto.precio }} Bs</td>
            <td>{{ producto.stock }}</td>
            <td>{{ producto.sabores?.nombre }}</td>
            <td>{{ producto.proveedores?.razonSocial }}</td>
            <td>
              <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(producto)" />
              <Button icon="pi pi-trash" aria-label="Eliminar" severity="danger" text
                @click="mostrarEliminarConfirm(producto)" />
            </td>
          </tr>
          <tr v-if="productosFiltrados.length === 0">
            <td colspan="8">No se encontraron resultados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <Button label="Anterior" :disabled="paginaActual === 1" @click="cambiarPagina(paginaActual - 1)" />
      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <Button label="Siguiente" :disabled="paginaActual === totalPaginas" @click="cambiarPagina(paginaActual + 1)" />
    </div>

    <Dialog v-model:visible="mostrarConfirmDialog" header="Confirmar Eliminación" :style="{ width: '25rem' }">
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="mostrarConfirmDialog = false" />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.producto-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffd6e1;
  padding: 20px;
  border-radius: 10px;
  margin-top: -30px;
}

.search-bar {
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
}

.table-container {
  width: 100%;
  max-width: 800px;
  overflow-x: auto;
}

.producto-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.producto-table th {
  background-color: #ffb3c1;
  color: #fff;
  padding: 10px;
}

.producto-table td {
  padding: 10px;
  border: 1px solid #ffd6e1;
}

.producto-table tr:nth-child(even) {
  background-color: #ffe5ec;
}

.producto-table tr:hover {
  background-color: #ffc2d1;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination button {
  min-width: 50px;
  background-color: #ff80ab;
  /* Light raspberry color */
  border: none;
  color: white;
  font-weight: bold;
  font-size: 10px;
  border-radius: 5px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #d81b60;
  /* Darker raspberry color */
}
</style>
