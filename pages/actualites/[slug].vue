<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
        <div class="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>

    <!-- Article -->
    <article v-else-if="article" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
        <NuxtLink to="/" class="hover:text-primary-600 dark:hover:text-primary-400">Accueil</NuxtLink>
        <span>/</span>
        <NuxtLink to="/actualites" class="hover:text-primary-600 dark:hover:text-primary-400">Actualités</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white">{{ article.title }}</span>
      </nav>

      <!-- Header -->
      <header class="mb-8">
        <!-- Catégorie -->
        <div class="mb-4">
          <span class="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
            {{ article.category }}
          </span>
        </div>

        <!-- Titre -->
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {{ article.title }}
        </h1>

        <!-- Meta -->
        <div class="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
          <!-- Auteur -->
          <div class="flex items-center gap-3">
            <div v-if="article.author.avatar" class="w-12 h-12 rounded-full overflow-hidden">
              <img :src="article.author.avatar" :alt="article.author.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span class="text-lg font-medium text-primary-600 dark:text-primary-400">
                {{ article.author.name.charAt(0) }}
              </span>
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ article.author.name }}</div>
              <div class="text-sm">{{ formatDate(article.published_at) }}</div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ article.reading_time }} min de lecture</span>
            </div>
            <div v-if="article.views" class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ article.views }} vues</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Image de couverture -->
      <div class="mb-12 rounded-xl overflow-hidden">
        <img 
          :src="article.cover_image" 
          :alt="article.title"
          class="w-full h-auto"
        />
      </div>

      <!-- Contenu -->
      <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div v-html="article.content"></div>
      </div>

      <!-- Tags -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mb-12">
        <span 
          v-for="tag in article.tags" 
          :key="tag"
          class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Navigation -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
        <NuxtLink 
          to="/actualites"
          class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux actualités
        </NuxtLink>
      </div>
    </article>

    <!-- Error -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article non trouvé</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Cet article n'existe pas ou a été supprimé</p>
      <NuxtLink 
        to="/actualites"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Voir tous les articles
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article, ArticleDetailResponse } from '~/types/article';

const route = useRoute();
const { getArticleBySlug } = useSecureApi();

const article = ref<Article | null>(null);
const loading = ref(true);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const fetchArticle = async () => {
  loading.value = true;
  
  try {
    const slug = route.params.slug as string;
    const response = await getArticleBySlug(slug) as ArticleDetailResponse;
    article.value = response.article;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'article:', error);
    article.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchArticle();
});

// SEO dynamique
useHead(() => {
  if (!article.value) {
    return {
      title: 'Article - Geyavo',
      meta: [
        { name: 'description', content: 'Découvrez cet article sur Geyavo' }
      ]
    };
  }

  const keywords = [
    ...(article.value.tags || []),
    article.value.category,
    'transport',
    'Côte d\'Ivoire',
    'voyage',
    'Geyavo'
  ].join(', ');

  return {
    title: `${article.value.title} - Geyavo`,
    meta: [
      // Description
      {
        name: 'description',
        content: article.value.excerpt
      },
      // Keywords avec tags
      {
        name: 'keywords',
        content: keywords
      },
      // Robots
      {
        name: 'robots',
        content: 'index, follow'
      },
      // Open Graph
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:title',
        content: article.value.title
      },
      {
        property: 'og:description',
        content: article.value.excerpt
      },
      {
        property: 'og:image',
        content: article.value.cover_image
      },
      {
        property: 'og:url',
        content: `https://geyavo.com/actualites/${article.value.slug}`
      },
      {
        property: 'article:published_time',
        content: article.value.published_at
      },
      {
        property: 'article:author',
        content: article.value.author.name
      },
      {
        property: 'article:section',
        content: article.value.category
      },
      ...(article.value.tags || []).map(tag => ({
        property: 'article:tag',
        content: tag
      })),
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: article.value.title
      },
      {
        name: 'twitter:description',
        content: article.value.excerpt
      },
      {
        name: 'twitter:image',
        content: article.value.cover_image
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: `https://geyavo.com/actualites/${article.value.slug}`
      }
    ],
    script: [
      // Données structurées JSON-LD pour Article
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.value.title,
          description: article.value.excerpt,
          image: article.value.cover_image,
          datePublished: article.value.published_at,
          dateModified: article.value.published_at,
          author: {
            '@type': 'Person',
            name: article.value.author.name,
            ...(article.value.author.avatar && {
              image: article.value.author.avatar
            })
          },
          publisher: {
            '@type': 'Organization',
            name: 'Geyavo',
            logo: {
              '@type': 'ImageObject',
              url: 'https://geyavo.com/logos/geyavo_full.png'
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://geyavo.com/actualites/${article.value.slug}`
          },
          keywords: article.value.tags?.join(', '),
          articleSection: article.value.category,
          wordCount: article.value.content.split(' ').length,
          timeRequired: `PT${article.value.reading_time}M`
        })
      }
    ]
  };
});
</script>

<style>
/* Styles pour le contenu de l'article */
.prose img {
  @apply rounded-lg;
}

.prose h2 {
  @apply text-3xl font-bold mt-12 mb-4;
}

.prose h3 {
  @apply text-2xl font-bold mt-8 mb-3;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul, .prose ol {
  @apply mb-4 ml-6;
}

.prose li {
  @apply mb-2;
}

.prose a {
  @apply text-primary-600 dark:text-primary-400 hover:underline;
}

.prose blockquote {
  @apply border-l-4 border-primary-600 pl-4 italic my-6;
}
</style>
