<template>
  <div class="dark:bg-gray-950">
    <BusSearchResults />
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search';

const route = useRoute();
const searchStore = useSearchStore();

// Récupérer le paramètre ref de l'URL
const refParam = route.params.ref as string;

// Vérifier si le paramètre est valide
if (!refParam) {
  navigateTo('/');
}

// Synchroniser le store avec le paramètre de route
searchStore.setSearchParams({
  type: 'bus',
  ref: refParam,
  from: null,
  to: null
});

// SEO dynamique
const seoData = computed(() => {
  return {
    title: `Ligne de bus ${refParam} - Horaires et itinéraire | Geyavo`,
    description: `Consultez les horaires, l'itinéraire et les arrêts de la ligne de bus ${refParam} en Côte d'Ivoire avec Geyavo.`,
    keywords: `bus ${refParam}, ligne ${refParam}, transport public, Côte d'Ivoire, horaires bus, itinéraire`,
    canonical: `/results/bus/${encodeURIComponent(refParam)}`,
    ogTitle: `Ligne de bus ${refParam} - Geyavo`,
    ogDescription: `Découvrez les informations complètes sur la ligne de bus ${refParam} : horaires, arrêts et itinéraire en Côte d'Ivoire.`,
  };
});

// Application du SEO
useHead(() => ({
  title: seoData.value.title,
  meta: [
    {
      name: 'description',
      content: seoData.value.description
    },
    {
      name: 'keywords',
      content: seoData.value.keywords
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      property: 'og:title',
      content: seoData.value.ogTitle
    },
    {
      property: 'og:description',
      content: seoData.value.ogDescription
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `https://geyavo.com${seoData.value.canonical}`
    },
    {
      property: 'og:site_name',
      content: 'Geyavo'
    },
    {
      property: 'og:locale',
      content: 'fr_CI'
    },
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:title',
      content: seoData.value.ogTitle
    },
    {
      name: 'twitter:description',
      content: seoData.value.ogDescription
    },
    {
      name: 'geo.region',
      content: 'CI'
    },
    {
      name: 'geo.country',
      content: 'Côte d\'Ivoire'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://geyavo.com${seoData.value.canonical}`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: seoData.value.title,
        description: seoData.value.description,
        url: `https://geyavo.com${seoData.value.canonical}`,
        mainEntity: {
          '@type': 'BusTrip',
          name: `Ligne de bus ${refParam}`,
          description: `Informations sur la ligne de bus ${refParam} en Côte d'Ivoire`
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Accueil',
              item: 'https://geyavo.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Recherche de bus',
              item: 'https://geyavo.com/results'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: `Ligne ${refParam}`,
              item: `https://geyavo.com${seoData.value.canonical}`
            }
          ]
        },
        provider: {
          '@type': 'Organization',
          name: 'Geyavo',
          url: 'https://geyavo.com',
          description: 'Plateforme de réservation de trajets en Côte d\'Ivoire'
        }
      })
    }
  ]
}));
</script>
