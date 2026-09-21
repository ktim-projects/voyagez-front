<template>
  <div class="min-h-screen dark:bg-gray-950 overflow-x-hidden">
    <Header v-if="!isSpecialPage" />
    <NuxtPage />
    <Footer v-if="!isSpecialPage" />
  </div>
</template>

<script setup lang="ts">
// Analytics et Speed Insights sont désormais des modules Nuxt déclarés dans
// nuxt.config.ts : ils injectent leur propre plugin client et n'ont plus de
// composant à monter ici.

const route = useRoute()

// Masquer Header et Footer sur les pages spéciales (maintenance, coming-soon)
const isSpecialPage = computed(() =>
  route.path === '/maintenance' || route.path === '/coming-soon'
)
</script>
