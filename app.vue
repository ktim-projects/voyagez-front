<template>
  <SpeedInsights />
  <div class="min-h-screen dark:bg-gray-950 overflow-x-hidden">
    <Header v-if="!isSpecialPage" />
    <Analytics />
    <NuxtPage />
    <Footer v-if="!isSpecialPage" />
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
</script>