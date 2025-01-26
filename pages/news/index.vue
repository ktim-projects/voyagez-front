<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center mb-12">Actualités</h1>
    <div v-if="pending" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Une erreur est survenue lors du chargement des actualités.
    </div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <NewsCard v-for="newsItem in data.news" :key="newsItem.id" :news="newsItem" />
      </div>
      
      <!-- Pagination -->
      <div v-if="data.pagination.totalPages > 1" class="flex justify-center items-center space-x-2 mt-12">
        <button 
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Page précédente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <div class="flex items-center">
          <span class="text-sm text-gray-700">
            Page {{ currentPage }} sur {{ data?.pagination.totalPages }}
          </span>
        </div>

        <button 
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === data?.pagination.totalPages"
          class="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Page suivante"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const currentPage = computed(() => Number(route.query.page) || 1)

const { data, pending, error, refresh } = await useFetch('/api/news', {
  query: computed(() => ({
    page: currentPage.value,
    limit: 9
  }))
})

const displayedPages = computed(() => {
  if (!data.value?.pagination.totalPages) return []
  
  const totalPages = data.value.pagination.totalPages
  const current = currentPage.value
  const delta = 2
  const range = []
  
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(totalPages - 1, current + delta);
    i++
  ) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < totalPages - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (totalPages !== 1) {
    range.push(totalPages)
  }
  
  return range
})

const changePage = (page: number) => {
  router.push({ query: { ...route.query, page } })
}
</script>
