<template>
  <div class="min-h-screen dark:bg-gray-950">
    <CarSearchResults v-if="searchStore.type === 'car'" />
    <BusSearchResults v-else-if="searchStore.type === 'bus'" />
    <div v-else class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">Aucune recherche en cours</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search';

const searchStore = useSearchStore();

// SEO
useHead({
  title: 'Résultats de recherche - Geyavo',
  meta: [
    {
      name: 'description',
      content: 'Résultats de votre recherche de trajets'
    }
  ]
});
</script>