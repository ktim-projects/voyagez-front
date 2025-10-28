<template>
  <NuxtLink 
    :to="`/actualites/${article.slug}`"
    class="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-light hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="article.cover_image" 
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
          {{ article.category }}
        </span>
      </div>
    </div>

    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ article.title }}
      </h3>

      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {{ article.excerpt }}
      </p>

      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
        <div class="flex items-center gap-3">
          <span class="text-xs">{{ formatDate(article.published_at) }}</span>
        </div>

        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs">{{ article.reading_time }} min</span>
        </div>
      </div>

      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
        <span 
          v-for="tag in article.tags.slice(0, 3)" 
          :key="tag"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article';

defineProps<{
  article: Article;
}>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};
</script>
