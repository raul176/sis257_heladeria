<script setup lang="ts">
import type { Proveedor } from '@/models/proveedor'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'proveedores'

const props = defineProps({
  mostrar: Boolean,
  proveedor: {
    type: Object as () => Proveedor,
    default: () => ({}) as Proveedor,
  },
  modoEdicion: Boolean,
})

const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const proveedor = ref<Proveedor>({ ...props.proveedor })

watch(
  () => props.proveedor,
  (newVal) => {
    proveedor.value = { ...newVal }
  }
)

async function handleSave() {
  try {
    const body = {
      razonSocial: proveedor.value.razonSocial,
      nit: proveedor.value.nit,
      telefono: proveedor.value.telefono,
      tipoProducto: proveedor.value.tipoProducto,
    }

    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${proveedor.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }

    emit('guardar')
    proveedor.value = {} as Proveedor
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Proveedor' : 'Crear Proveedor'"
      style="width: 30rem"
    >
      <div class="flex items-center gap-4 mb-3">
        <label for="razonSocial" class="font-semibold w-3">Razón Social</label>
        <InputText id="razonSocial" v-model="proveedor.razonSocial" class="flex-auto" autocomplete="off" autofocus />
      </div>

      <div class="flex items-center gap-4 mb-3">
        <label for="nit" class="font-semibold w-3">NIT</label>
        <InputText id="nit" v-model="proveedor.nit" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex items-center gap-4 mb-3">
        <label for="telefono" class="font-semibold w-3">Teléfono</label>
        <InputText id="telefono" v-model="proveedor.telefono" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="tipoProducto" class="font-semibold w-3">Tipo Producto</label>
        <InputText id="tipoProducto" v-model="proveedor.tipoProducto" class="flex-auto" autocomplete="off" />
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary"
          @click="dialogVisible = false" />
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
