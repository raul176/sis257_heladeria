<script setup lang="ts">
import type { Usuario } from '@/models/usuario'
import type { Venta } from '@/models/venta'
import type { Cliente } from '@/models/cliente'
import http from '@/plugins/axios'
import { InputMask, Select } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'ventas'
const props = defineProps({
  mostrar: Boolean,
  venta: {
    type: Object as () => Venta,
    default: () => ({}) as Venta,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const clientes = ref<Cliente[]>([])
const usuarios = ref<Usuario[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const venta = ref<Venta>({ ...props.venta })

async function obtenerClientes() {
  clientes.value = await http.get('clientes').then((response) => response.data)
}

async function obtenerUsuarioes() {
  usuarios.value = await http.get('usuarios').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idUsuario: venta.value.usuario.idUsuario,
      idCliente: venta.value.cliente.id,
      tipoPago: venta.value.tipoPago,
      montoTotal: venta.value.montoTotal,
      montoPagado: venta.value.montoPagado,
      cambio: venta.value.cambio,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${venta.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    venta.value = {} as Venta
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerClientes()
      obtenerUsuarioes()

      if (props.venta?.id) {
        venta.value = { ...props.venta }
        obtenerUsuarioes()
      } else {
        //cliente.value = { id: 0 } as Cliente
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Canción'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="cliente" class="font-semibold w-3">Cliente</label>
        <Select
          id="cliente"
          v-model="venta.cliente.id"
          :options="clientes"
          optionLabel="tipoPago"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="usuario" class="font-semibold w-3">Usuario</label>
        <Select
          id="usuario"
          v-model="venta.usuario.idUsuario"
          :options="usuarios"
          optionLabel="usuario"
          optionValue="id"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="tipoPago" class="font-semibold w-3">Tipo Pago</label>
        <InputText
          id="tipoPago"
          v-model="venta.tipoPago"
          class="flex-auto"
          autocomplete="off"
          maxlength="40"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="montoTotal" class="font-semibold w-3">Monto Total</label>
        <InputMask
          id="montoTotal"
          v-model="venta.montoTotal"
          class="flex-auto"
          autocomplete="off"
          mask="99:99"
          placeholder="03:15"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="montoPagado" class="font-semibold w-3">Monto Pagado</label>
        <InputText
          id="montoPagado"
          v-model="venta.montoPagado"
          class="flex-auto"
          autocomplete="off"
          maxlength="30"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="cambio" class="font-semibold w-3">Cambio</label>
        <InputText
          id="cambio"
          v-model="venta.cambio"
          class="flex-auto"
          autocomplete="off"
          maxlength="250"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
