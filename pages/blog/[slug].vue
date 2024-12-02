<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <article v-if="post">
      <header class="text-center mb-12">
        <div class="mb-4">
          <span class="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-full">
            {{ post.category }}
          </span>
        </div>
        <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
        <div class="flex items-center justify-center text-gray-500 space-x-4">
          <span>Par {{ post.author }}</span>
          <span>•</span>
          <span>{{ post.date }}</span>
          <span>•</span>
          <span>{{ post.readTime }}</span>
        </div>
      </header>

      <div class="prose prose-lg mx-auto">
        <div class="mb-8">
          <img :src="post.image" :alt="post.title" class="w-full rounded-lg">
        </div>
        
        <div v-html="post.content"></div>
      </div>
    </article>

    <EmptyState
      v-else
      title="Article non trouvé"
      description="L'article que vous recherchez n'existe pas ou a été supprimé."
      image="/images/empty-search.svg"
    >
      <template #action>
        <NuxtLink to="/blog" class="mt-4 text-primary-600 hover:text-primary-700">
          Retourner aux articles
        </NuxtLink>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { blogPosts } from '~/server/data/mockData';

const route = useRoute();
const post = computed(() => {
  return blogPosts.find(p => p.slug === route.params.slug);
});

// SEO
useHead(() => ({
  title: post.value ? `${post.value.title} - VoyagezCi` : 'Article - VoyagezCi',
  meta: [
    {
      name: 'description',
      content: post.value?.excerpt || 'Article sur le transport en Côte d\'Ivoire'
    }
  ]
}));
</script>