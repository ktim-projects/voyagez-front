<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="w-48 h-48 mb-8">
      <img :src="image" :alt="title" class="w-full h-full object-contain">
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 text-center max-w-sm">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/images/empty-state.svg'
  }
});
</script>