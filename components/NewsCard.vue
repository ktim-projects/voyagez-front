<template>
  <article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <NuxtLink :to="`/news/${news.id}`" class="block">
      <div class="relative h-48">
        <img :src="news.image" :alt="news.title" class="w-full h-full object-cover">
        <div class="absolute top-4 left-4" v-if="news.category">
          <span class="px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded-full">
            {{ news.category }}
          </span>
        </div>
      </div>
      <div class="p-6">
        <div class="flex items-center text-sm text-gray-500 mb-2">
          <span>{{ formatDate(news.created_at) }}</span>
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-900 hover:text-primary-600 transition-colors">
          {{ news.title }}
        </h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ news.description }}</p>
        <!-- <div class="flex items-center">
          <span class="text-sm text-gray-500">Par {{ news.author }}</span>
        </div> -->
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
interface News {
  id: number
  title: string
  description: string
  image: string
  category: string
  author: string
  created_at: string
}

defineProps<{
  news: News
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
