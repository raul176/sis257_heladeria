<script setup lang="ts">
import ProveedorList from '@/components/proveedor/ProveedorList.vue'
import ProveedorSave from '@/components/proveedor/ProveedorSave.vue'
import Button from 'primevue/button'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const proveedorListRef = ref<typeof ProveedorList | null>(null)
const proveedorEdit = ref<any>(null)

function handleCreate() {
  proveedorEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(proveedor: any) {
  proveedorEdit.value = proveedor
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  proveedorListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="m-4 heladeria-container">
    <h2 class="heladeria-title">Proveedores</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" class="heladeria-button" @click="handleCreate" />
    <div class="heladeria-list-container">
      <ProveedorList ref="proveedorListRef" @edit="handleEdit" />
    </div>
    <ProveedorSave
      :mostrar="mostrarDialog"
      :proveedor="proveedorEdit"
      :modoEdicion="!!proveedorEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped>
.heladeria-container {
  background-color: #ffd6e1; /* Light pink background */
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.heladeria-title {
  font-family: 'Pacifico', cursive; /* Fun font for a heladería vibe */
  color: #d81b60; /* Raspberry color */
  text-align: center;
  margin-bottom: 20px;
}

.heladeria-button {
  background-color: #ff80ab; /* Light raspberry color */
  border: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.heladeria-button:hover {
  background-color: #d81b60; /* Darker raspberry color */
}

.heladeria-list-container {
  display: flex;
  justify-content: center; /* Center the table horizontally */
  margin-top: 20px;
}

table {
  width: 80%; /* Adjust table width */
  border-collapse: collapse;
  background-color: #fff; /* White background for contrast */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

table th, table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ffd6e1; /* Light pink border */
}

table th {
  background-color: #ff80ab; /* Light raspberry color */
  color: white;
  font-weight: bold;
}

table tr:hover {
  background-color: #ffe4ec; /* Slightly darker pink for hover effect */
}
</style>
