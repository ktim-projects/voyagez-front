<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Dernières Actualités</h2>
        <p class="text-gray-600">Restez informé des dernières nouvelles du transport</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BlogCard v-for="post in posts.slice(0, 3)" :key="post.id" :post="post" />
      </div>

      <div class="text-center mt-12">
        <NuxtLink to="/blog" class="btn-primary">
          Voir tous les articles
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { blogPosts } from '~/server/data';

const loading = ref(true);
const posts = ref(blogPosts);

onMounted(() => {
  loading.value = false;
});
</script>