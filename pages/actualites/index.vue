<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Actualité sur transport routier</h1>
        <p class="text-xl text-primary-100 max-w-2xl">
          Retrouvez toute l'actualité du transport routier, compagnie de transport, accident de la circulation...
        </p>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap gap-3">
          <button
            @click="selectedCategory = ''"
            :class="selectedCategory === '' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Tous
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="selectedCategory === category 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <!-- Articles -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-xl"></div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-b-xl">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Articles Grid -->
      <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ArticleCard 
          v-for="article in articles" 
          :key="article.id"
          :article="article"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun article trouvé</h3>
        <p class="text-gray-600 dark:text-gray-400">Revenez bientôt pour découvrir nos actualités</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12 gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Précédent
        </button>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="currentPage === page 
            ? 'bg-primary-600 text-white' 
            : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
          class="px-4 py-2 rounded-lg transition-colors"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article, ArticleListResponse } from '~/types/article';

const { getArticles } = useSecureApi();

const articles = ref<Article[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const selectedCategory = ref('');
const isMounted = ref(false);

const categories = ['Transport', 'Actualité', 'Conseils', 'Accidents'];

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const fetchArticles = async () => {
  loading.value = true;
  
  try {
    const response = await getArticles({
      page: currentPage.value,
      limit: 12,
      category: selectedCategory.value || undefined
    }) as ArticleListResponse;
    
    articles.value = response.articles;
    totalPages.value = Math.ceil(response._meta.total / response._meta.limit);
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error);
    articles.value = [];
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Watch pour recharger les articles (seulement après le montage)
watch(selectedCategory, () => {
  if (!isMounted.value) return;
  currentPage.value = 1;
  fetchArticles();
});

watch(currentPage, () => {
  if (!isMounted.value) return;
  fetchArticles();
});

// Charger les articles au montage
onMounted(() => {
  fetchArticles();
  // Activer les watchers après le premier chargement
  nextTick(() => {
    isMounted.value = true;
  });
});

// SEO
useHead({
  title: 'Actualités Transport Côte d\'Ivoire - Blog Geyavo',
  meta: [
    {
      name: 'description',
      content: 'Découvrez les dernières actualités du transport en Côte d\'Ivoire. Conseils, événements et informations utiles pour vos voyages en car et bus.'
    },
    {
      name: 'keywords',
      content: 'actualités transport, blog voyage, Côte d\'Ivoire, conseils voyage, transport Abidjan, car Côte d\'Ivoire, bus Abidjan, Geyavo'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    // Open Graph
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:title',
      content: 'Actualités Transport - Geyavo'
    },
    {
      property: 'og:description',
      content: 'Découvrez les dernières actualités du transport en Côte d\'Ivoire. Conseils, événements et informations utiles pour vos voyages.'
    },
    {
      property: 'og:url',
      content: 'https://geyavo.com/actualites'
    },
    {
      property: 'og:site_name',
      content: 'Geyavo'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:title',
      content: 'Actualités Transport - Geyavo'
    },
    {
      name: 'twitter:description',
      content: 'Découvrez les dernières actualités du transport en Côte d\'Ivoire.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://geyavo.com/actualites'
    }
  ],
  script: [
    // Données structurées JSON-LD pour Blog
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog Geyavo',
        description: 'Actualités et conseils sur le transport en Côte d\'Ivoire',
        url: 'https://geyavo.com/actualites',
        publisher: {
          '@type': 'Organization',
          name: 'Geyavo',
          logo: {
            '@type': 'ImageObject',
            url: 'https://geyavo.com/logos/geyavo_full.png'
          }
        },
        inLanguage: 'fr-CI'
      })
    }
  ]
});
</script>
