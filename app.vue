<template>
  <div class="min-h-screen dark:bg-gray-950">
    <Header />
    <Analytics />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup lang="ts">
// App level setup
import { Analytics } from '@vercel/analytics/nuxt';
</script>