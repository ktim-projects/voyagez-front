<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold mb-4">Actualités et Guides</h1>
      <p class="text-gray-600">Découvrez nos derniers articles sur le transport en Côte d'Ivoire</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogCard v-for="post in displayedPosts" :key="post.id" :post="post" />
    </div>

    <div v-if="hasMorePosts" class="text-center mt-12">
      <button 
        @click="loadMore"
        class="btn-primary"
        :disabled="loading"
      >
        Charger plus d'articles
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blogPosts } from '~/server/data';

const loading = ref(true);
const page = ref(1);
const postsPerPage = 9;

const displayedPosts = computed(() => {
  return blogPosts.slice(0, page.value * postsPerPage);
});

const hasMorePosts = computed(() => {
  return displayedPosts.value.length < blogPosts.length;
});

const loadMore = () => {
  page.value++;
};

onMounted(() => {
  loading.value = false;
});

// SEO
useHead({
  title: 'Actualités et Guides - VoyagezCi',
  meta: [
    {
      name: 'description',
      content: 'Découvrez nos derniers articles sur le transport en Côte d\'Ivoire, guides et conseils pour vos voyages.'
    }
  ]
});
</script>