<template>
  <SpeedInsights />
  <div class="min-h-screen dark:bg-gray-950">
    <Header v-if="!isMaintenancePage" />
    <Analytics />
    <NuxtPage />
    <Footer v-if="!isMaintenancePage" :class="{ 'hidden md:block': isBusResultsPage }" />
  </div>
</template>

<script setup lang="ts">
// App level setup
import { Analytics } from '@vercel/analytics/nuxt';
import { SpeedInsights } from '@vercel/speed-insights/vue';

const route = useRoute()

// Masquer Header et Footer sur la page de maintenance
const isMaintenancePage = computed(() => route.path === '/maintenance')

// Masquer Footer en mobile sur les pages de résultats de bus
const isBusResultsPage = computed(() => route.path.startsWith('/results/bus/'))
</script>