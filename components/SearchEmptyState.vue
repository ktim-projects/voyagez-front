<template>
  <div class="text-center py-12">
    <svg 
      class="mx-auto h-16 w-16 text-gray-300" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="1" 
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    <h3 class="mt-4 text-lg font-semibold text-gray-600">
      {{ title }}
    </h3>
    <p class="mt-2 text-sm text-gray-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
