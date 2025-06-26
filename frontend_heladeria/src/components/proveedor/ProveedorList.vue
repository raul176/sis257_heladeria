<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'proveedores'
const proveedores = ref<Proveedor[]>([])
const emit = defineEmits(['edit'])
const proveedorDelete = ref<Proveedor | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

// Paginación
const paginaActual = ref<number>(1)
const elementosPorPagina = ref<number>(5)

async function obtenerLista() {
  proveedores.value = await http.get(ENDPOINT).then((response) => response.data)
}

const proveedoresFiltrados = computed(() => {
  const filtrados = proveedores.value.filter((proveedor) =>
    proveedor.razonSocial.toLowerCase().includes(busqueda.value.toLowerCase())
  )
  const inicio = (paginaActual.value - 1) * elementosPorPagina.value
  const fin = inicio + elementosPorPagina.value
  return filtrados.slice(inicio, fin)
})

const totalPaginas = computed(() => {
  const filtrados = proveedores.value.filter((proveedor) =>
    proveedor.razonSocial.toLowerCase().includes(busqueda.value.toLowerCase())
  )
  return Math.ceil(filtrados.length / elementosPorPagina.value)
})

function cambiarPagina(nuevaPagina: number) {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
  }
}

function emitirEdicion(proveedor: Proveedor) {
  emit('edit', proveedor)
}

function mostrarEliminarConfirm(proveedor: Proveedor) {
  proveedorDelete.value = proveedor
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${proveedorDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div class="sabor-list-container">
    <div class="search-bar">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por razón social" />
      </InputGroup>
    </div>
    <div class="table-container">
      <table class="sabor-table">
        <thead>
          <tr>
            <th>Nro.</th>
            <th>Razón Social</th>
            <th>NIT</th>
            <th>Teléfono</th>
            <th>Tipo Producto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(proveedor, index) in proveedoresFiltrados" :key="proveedor.id">
            <td>{{ (paginaActual - 1) * elementosPorPagina + index + 1 }}</td>
            <td>{{ proveedor.razonSocial }}</td>
            <td>{{ proveedor.nit }}</td>
            <td>{{ proveedor.telefono }}</td>
            <td>{{ proveedor.tipoProducto }}</td>
            <td>
              <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(proveedor)" />
              <Button
                icon="pi pi-trash"
                aria-label="Eliminar"
                severity="danger"
                text
                @click="mostrarEliminarConfirm(proveedor)"
              />
            </td>
          </tr>
          <tr v-if="proveedoresFiltrados.length === 0">
            <td colspan="6">No se encontraron resultados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <Button
        label="Anterior"
        :disabled="paginaActual === 1"
        @click="cambiarPagina(paginaActual - 1)"
      />
      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <Button
        label="Siguiente"
        :disabled="paginaActual === totalPaginas"
        @click="cambiarPagina(paginaActual + 1)"
      />
    </div>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este proveedor?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.sabor-list-container {
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

.sabor-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.sabor-table th {
  background-color: #ffb3c1;
  color: #fff;
  padding: 10px;
}

.sabor-table td {
  padding: 10px;
  border: 1px solid #ffd6e1;
}

.sabor-table tr:nth-child(even) {
  background-color: #ffe5ec;
}

.sabor-table tr:hover {
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
  background-color: #ff80ab; /* Light raspberry color */
  border: none;
  color: white;
  font-weight: bold;
  font-size: 10px;
  border-radius: 5px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #d81b60; /* Darker raspberry color */
}
</style>
