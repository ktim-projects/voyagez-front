<template>
  <div>
    <CarSearchResults v-if="route.query.type === 'car'" />
    <BusSearchResults v-else />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>