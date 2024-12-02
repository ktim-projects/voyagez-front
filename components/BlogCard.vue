<template>
  <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div class="relative h-48">
      <img :src="post.image" :alt="post.title" class="w-full h-full object-cover">
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded-full">
          {{ post.category }}
        </span>
      </div>
    </div>
    <div class="p-6">
      <div class="flex items-center text-sm text-gray-500 mb-2">
        <span>{{ post.date }}</span>
        <span class="mx-2">•</span>
        <span>{{ post.readTime }}</span>
      </div>
      <h3 class="text-xl font-semibold mb-2">
        <NuxtLink :to="`/blog/${post.slug}`" class="hover:text-primary-600">
          {{ post.title }}
        </NuxtLink>
      </h3>
      <p class="text-gray-600 text-sm mb-4">{{ post.excerpt }}</p>
      <div class="flex items-center">
        <span class="text-sm text-gray-500">Par {{ post.author }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/server/data/mockData';

defineProps<{
  post: BlogPost
}>();
</script>