<script setup lang="ts">
import type { Venta } from '@/models/venta'
import http from '@/plugins/axios'
import { Column, DataTable, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'ventas'
const ventas = ref<Venta[]>([])
const emit = defineEmits(['edit'])
const ventaDelete = ref<Venta | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  ventas.value = await http.get(ENDPOINT).then((response) => response.data)
}

const ventasFiltrados = computed(() => {
  return ventas.value.filter(
    (venta) =>
      venta.tipoPago.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      venta.usuario.usuario.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      venta.cliente.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(venta: Venta) {
  emit('edit', venta)
}

function mostrarEliminarConfirm(venta: Venta) {
  ventaDelete.value = venta
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${ventaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-2">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por tipo pago" />
      </InputGroup>
    </div>
    <div>
      <DataTable
        :value="ventasFiltrados"
        paginator
        scrollable
        scrollHeight="flex"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
      >
        <Column
          field="usuario.usuario"
          header="Usuario"
          sortable
          style="min-width: 100px"
        ></Column>
        <!-- <Column
          field="cliente.nombre"
          header="Cliente"
          sortable
          style="min-width: 100px"
        ></Column> -->
        <Column field="tipoPago" header="Tipo Pago" sortable style="min-width: 100px"></Column>
        <Column field="montoTotal" header="Monto Total" style="min-width: 100px"></Column>
        <Column field="montoPagado" header="Monto Pagado" style="min-width: 100px"></Column>
        <Column field="cambio" header="Cambio" style="min-width: 100px"></Column>
        <Column header="Acciones" frozen alignFrozen="right" style="min-width: 120px">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <table v-if="false">
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Usuario</th>
          <!-- <th>Cliente</th> -->
          <th>Tipo Pago</th>
          <th>Monto Total</th>
          <th>Monto Pagado</th>
          <th>Cambio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, index) in ventasFiltrados" :key="venta.id">
          <td>{{ index + 1 }}</td>
          <td>{{ venta.usuario.usuario }}</td>
          <!-- <td>{{ venta.cliente.nombre }}</td> -->
          <td>{{ venta.tipoPago }}</td>
          <td>{{ venta.montoTotal }}</td>
          <td>{{ venta.montoPagado }}</td>
          <td>{{ venta.cambio }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(venta)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(venta)"
            />
          </td>
        </tr>
        <tr v-if="ventasFiltrados.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
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

<style scoped></style>
