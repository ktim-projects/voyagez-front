<template>
   <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Dernières actualités</h2>
            <p class="text-gray-600">Restez informé des dernières nouvelles du transport en Côte d'Ivoire</p>
          </div>
          <NuxtLink 
            to="/news" 
            class="inline-flex items-center mt-4 md:mt-0 text-gray-900 hover:text-gray-800 transition-colors duration-200"
          >
            <span class="mr-2">Voir plus d'actualités</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
        <div v-if="pending" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      <div v-else-if="error" class="text-center text-corail-600">
        Une erreur est survenue lors du chargement des actualités.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NewsCard v-for="news in data?.news" :key="news.id" :news="news" />
      </div>
      </div>
    </section>
  <!-- <section class="py-16 bg-gray-50 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">Dernières actualités</h2>
        <NuxtLink 
          to="/news" 
          class="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          Voir plus
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </NuxtLink>
      </div>

      <div v-if="pending" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      <div v-else-if="error" class="text-center text-red-600">
        Une erreur est survenue lors du chargement des actualités.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <NewsCard v-for="news in data?.news" :key="news.id" :news="news" />
      </div>
    </div>
  </section> -->
</template>

<script setup lang="ts">
const { data, pending, error } = await useFetch('/api/news', {
  query: {
    page: 1,
    limit: 3
  }
})
</script>
