<template>
  <div class="min-h-screen dark:bg-gray-950">
    <CarSearchResults v-if="searchStore.type === 'car'" />
    <BusSearchResults v-else-if="searchStore.type === 'bus'" />
    <div v-else class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">Aucune recherche en cours</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '~/stores/search';
import { getCityFromSlug } from '~/utils/cities';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

// Récupérer les slugs depuis l'URL
const fromSlug = route.params.from as string;
const toSlug = route.params.to as string;

// Convertir les slugs en noms de villes officiels
const from = getCityFromSlug(fromSlug);
const to = getCityFromSlug(toSlug);

// Vérifier si les villes sont valides
if (!from || !to) {
  // Rediriger vers la page des destinations populaires si les villes sont invalides
  navigateTo('/destinations-populaires');
}

// Synchroniser le store avec les noms de villes officiels (avec accents)
searchStore.setSearchParams({
  type: 'car',
  from,
  to
});

// SEO dynamique
const seoData = computed(() => {
  // Utiliser les valeurs avec vérification de type
  const fromCity = from || 'Départ';
  const toCity = to || 'Arrivée';
  
  return {
    title: `Trajet ${fromCity} – ${toCity} en car | Geyavo`,
    description: `Comparez les horaires et prix des cars ${fromCity} – ${toCity} avec Geyavo, le comparateur de transport en Côte d'Ivoire.`,
    keywords: `${fromCity}, ${toCity}, car, transport, voyage, Côte d'Ivoire, horaires, prix, réservation`,
    canonical: `/results/${fromSlug}/${toSlug}`,
    ogTitle: `Trajets en car ${fromCity} → ${toCity}`,
    ogDescription: `Trouvez et comparez les meilleurs trajets en car de ${fromCity} à ${toCity}. Réservez votre voyage en Côte d'Ivoire.`,
  };
});

// Application du SEO
useHead(() => ({
  title: seoData.value.title,
  meta: [
    // Description
    {
      name: 'description',
      content: seoData.value.description
    },
    // Keywords
    {
      name: 'keywords',
      content: seoData.value.keywords
    },
    // Robots
    {
      name: 'robots',
      content: 'index, follow'
    },
    // Open Graph
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
    // Twitter Card
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
    // Geo tags pour la Côte d'Ivoire
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
    // Canonical URL
    {
      rel: 'canonical',
      href: `https://geyavo.com${seoData.value.canonical}`
    }
  ],
  script: [
    // Données structurées JSON-LD pour le SEO
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: seoData.value.title,
        description: seoData.value.description,
        url: `https://geyavo.com${seoData.value.canonical}`,
        mainEntity: {
          '@type': 'SearchResultsPage',
          name: `Résultats de recherche ${from || 'Départ'} - ${to || 'Arrivée'}`,
          description: seoData.value.description,
          about: {
            '@type': 'Trip',
            name: `Trajet ${from || 'Départ'} - ${to || 'Arrivée'}`,
            description: `Voyage en car de ${from || 'Départ'} à ${to || 'Arrivée'}`,
            departureLocation: {
              '@type': 'Place',
              name: from || 'Départ',
              addressCountry: 'CI'
            },
            arrivalLocation: {
              '@type': 'Place',
              name: to || 'Arrivée',
              addressCountry: 'CI'
            }
          }
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
              name: 'Recherche de trajets',
              item: 'https://geyavo.com/results'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: `${from || 'Départ'} → ${to || 'Arrivée'}`,
              item: `https://geyavo.com${seoData.value.canonical}`
            }
          ]
        },
        provider: {
          '@type': 'Organization',
          name: 'Geyavo',
          url: 'https://geyavo.com',
          description: 'Plateforme de comparaison de trajets de car et de bus en Côte d\'Ivoire'
        }
      })
    }
  ]
}));
</script>
