<script setup lang="ts">
import SaborList from '@/components/sabor/SaborList.vue'
import SaborSave from '@/components/sabor/SaborSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const saborListRef = ref<typeof SaborList | null>(null)
const saborEdit = ref<any>(null)

function handleCreate() {
  saborEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(sabor: any) {
  saborEdit.value = sabor
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  saborListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <h2>Sabores</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" />
    <SaborList ref="saborListRef" @edit="handleEdit" />
    <SaborSave
      :mostrar="mostrarDialog"
      :sabor="saborEdit"
      :modoEdicion="!!saborEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>
