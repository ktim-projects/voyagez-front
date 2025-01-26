<template>
  <div class="container mx-auto px-4 py-12">
    <NuxtLink to="/news" class="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Retour aux actualités
    </NuxtLink>

    <div v-if="pending" class="flex justify-center mt-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else-if="error" class="mt-8 text-center">
      <div class="text-red-600 mb-4">
        {{ error.message || 'Une erreur est survenue lors du chargement de l\'actualité.' }}
      </div>
      <NuxtLink to="/news" class="text-primary-600 hover:text-primary-700">
        Retourner à la liste des actualités
      </NuxtLink>
    </div>

    <div v-else-if="data" class="max-w-4xl mx-auto">
      <article class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="relative h-96">
          <img :src="data.image" :alt="data.title" class="w-full h-full object-cover">
          <div class="absolute top-6 left-6">
            <span class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-full">
              {{ data.category }}
            </span>
          </div>
        </div>
        
        <div class="p-8">
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span>{{ formatDate(data.created_at) }}</span>
            <span class="mx-2">•</span>
            <span>Par {{ data.author }}</span>
          </div>
          
          <h1 class="text-4xl font-bold mb-6">{{ data.title }}</h1>
          
          <div class="prose prose-lg max-w-none">
            {{ data.content }}
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const { data, pending, error } = await useFetch(`/api/news/${route.params.id}`, {
  key: route.params.id as string
})
</script>
