<template>
  <Dialog v-model:visible="visible" :header="isEdit ? 'Editar Cliente' : 'Nuevo Cliente'"
    :style="{ width: '420px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }" :modal="true"
    :closable="true" :closeOnEscape="true" @hide="onClose" class="custom-dialog">
    <div class="form-content">
      <div class="field">
        <label for="nombre" class="form-label">Nombre Completo</label>
        <InputText id="nombre" v-model="cliente.nombre" class="form-input" autocomplete="off" autofocus required />
      </div>
      <div class="field">
        <label for="nit" class="form-label">NIT</label>
        <InputText id="nit" v-model="cliente.nit" class="form-input" autocomplete="off" autofocus required />
      </div>
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text btn-cancel" :disabled="loading"
        @click="onClose" />
      <Button :label="isEdit ? 'Actualizar' : 'Guardar'" icon="pi pi-check" :loading="loading" class="btn-save"
        @click="handleSave" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { reactive, ref, watch } from 'vue'
import http from '../../plugins/axios'

const toast = useToast()
const ENDPOINT = '/clientes'

const props = defineProps<{
  visible: boolean
  clienteData?: Partial<{
    id: number
    nombre: string
    nit: string
    direccion: string
    telefono: string
  }>
  isEdit?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', cliente: any): void
  (e: 'close'): void
}>()

const visible = ref(props.visible)
watch(() => props.visible, v => visible.value = v)
watch(visible, v => emit('update:visible', v))

const cliente = reactive({
  nombre: null,
  nit: null,
  direccion: null,
  telefono: null
})

watch(
  () => props.clienteData,
  (data) => {
    if (data) {
      Object.assign(cliente, data)
    } else {
      Object.assign(cliente, { nombre: null, nit: null, direccion: null, telefono: null })
    }
  },
  { immediate: true }
)

const loading = ref(props.loading ?? false)
const isEdit = props.isEdit ?? false

async function handleSave() {
  loading.value = true
  try {
    const body = {
      nombre: cliente.nombre,
      nit: cliente.nit,
      direccion: cliente.direccion,
      telefono: cliente.telefono
    }
    await http.post(ENDPOINT, body)
    emit('save', { ...cliente })
    Object.assign(cliente, { nombre: '', nit: '', direccion: '', telefono: '' })
    visible.value = false
  } catch (error: any) {
    console.error('Error al guardar el cliente:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'No se pudo guardar el cliente',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

function onClose() {
  visible.value = false
  emit('close')
}
</script>

<style scoped>
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.2rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
}
</style>
