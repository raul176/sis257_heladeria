<script setup lang="ts">
import type { Producto } from '@/models/producto'
import type { Proveedor } from '@/models/proveedor'
import type { Sabor } from '@/models/sabor'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import { computed, ref, watch, onMounted } from 'vue'
import { InputNumber } from 'primevue'

const ENDPOINT = 'productos'
const props = defineProps({
  mostrar: Boolean,
  producto: {
    type: Object as () => Producto,
    default: () => ({}) as Producto,
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

const producto = ref<Producto>({ ...props.producto })
watch(
  () => props.producto,
  async (newVal) => {
    if (proveedores.value.length === 0 || sabores.value.length === 0) {
      await cargarListas()
    }
    producto.value = {
      ...newVal,
      idSabor: newVal.idSabor ? Number(newVal.idSabor) : null,
      idProveedor: newVal.idProveedor ? Number(newVal.idProveedor) : null,
    }
  },
)

// Listas de proveedores y sabores
const proveedores = ref<Proveedor[]>([])
const sabores = ref<Sabor[]>([])

async function cargarListas() {
  proveedores.value = await http.get('proveedores').then(res => res.data)
  sabores.value = await http.get('sabores').then(res => res.data)
}

onMounted(() => {
  cargarListas()
})

async function handleSave() {
  try {
    const body = {
      nombre: producto.value.nombre,
      presentacion: producto.value.presentacion,
      precio: Number(producto.value.precio),
      stock: producto.value.stock,
      idProveedor: producto.value.idProveedor,
      idSabor: producto.value.idSabor,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${producto.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    producto.value = {} as Producto
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="props.modoEdicion ? 'Editar Producto' : 'Crear Producto'"
      style="width: 30rem">
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-3">Nombre</label>
        <InputText id="nombre" v-model="producto.nombre" class="flex-auto" autocomplete="off" autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="presentacion" class="font-semibold w-3">Presentación</label>
        <InputText id="presentacion" v-model="producto.presentacion" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="precio" class="font-semibold w-3">Precio (Bs)</label>
        <InputNumber id="precio" v-model="producto.precio" :step="0.5" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="stock" class="font-semibold w-3">Stock</label>
        <InputNumber id="stock" v-model="producto.stock" :step="1" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="sabor" class="font-semibold w-3">Sabor</label>
        <Dropdown id="sabor" v-model="producto.idSabor" :options="sabores" optionLabel="nombre" optionValue="id"
          placeholder="Seleccione un sabor" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="proveedor" class="font-semibold w-3">Proveedor</label>
        <Dropdown id="proveedor" v-model="producto.idProveedor" :options="proveedores" optionLabel="razonSocial"
          optionValue="id" placeholder="Seleccione un proveedor" class="flex-auto" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary"
          @click="dialogVisible = false"></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
