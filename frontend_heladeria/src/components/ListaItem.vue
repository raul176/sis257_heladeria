<script setup lang="ts">
defineProps<{
  color: { clave: string; valor: string }
}>()
</script>

<template>
  <li :style="'color:' + color.clave">
    <b>{{ color.valor }}</b>
  </li>
</template>

<style scoped></style>
