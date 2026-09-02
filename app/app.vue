<template>
  <div>
    <LayoutsNavbar v-if="route.path.startsWith('/admin') === false" />
    <NuxtPage />
  </div>
</template>

<script setup>
const route = useRoute()
</script>