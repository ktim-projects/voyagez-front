<template>
  <SpeedInsights />
  <div class="min-h-screen dark:bg-gray-950">
    <Header v-if="!isSpecialPage" />
    <Analytics />
    <NuxtPage />
    <Footer v-if="!isSpecialPage" :class="{ 'hidden md:block': isBusResultsPage }" />
  </div>
</template>

<script setup lang="ts">
// App level setup
import { Analytics } from '@vercel/analytics/nuxt';
import { SpeedInsights } from '@vercel/speed-insights/vue';

const route = useRoute()

// Masquer Header et Footer sur les pages spéciales (maintenance, coming-soon)
const isSpecialPage = computed(() => 
  route.path === '/maintenance' || route.path === '/coming-soon'
)

// Masquer Footer en mobile sur les pages de résultats de bus
const isBusResultsPage = computed(() => route.path.startsWith('/results/bus/'))
</script>