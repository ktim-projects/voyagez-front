<template>
  <div class="min-h-screen flex flex-col dark:bg-gray-950">
    <!-- Fixed Search Form -->
    <div class="bg-white md:bg-white dark:bg-gray-900 dark:md:bg-gray-900 sticky top-0 md:top-16 z-40">
      
      <!-- Mobile Header -->
      <div class="bg-primary-600 md:hidden fixed top-0 left-0 right-0 z-50 shadow-md">
        <div class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <NuxtLink to="/" class="text-white">
                <ChevronLeft class="w-5 h-5" />
              </NuxtLink>
              <div v-if="departures.length > 0" class="text-white font-medium">
                {{ fromCity }} → {{ toCity }}
              </div>
              <div v-else class="text-white font-medium">
                {{ $t('results.searchTitle') }}
              </div>
            </div>
            <AppButton 
              v-if="hasSearched && fromCity && toCity"
              variant="outline" 
              size="small"
              :label="$t('common.modify')"
              :fullWidth="false"
              class="!text-white !border-white hover:!bg-white/10"
              @click="showSearchModal = true"
            />
          </div>
        </div>
      </div>

      <!-- Desktop Search Form -->
      <div class="hidden md:block">
        <div class="container mx-auto px-4 py-4">
          <form @submit.prevent="handleSearch" class="grid gap-2 md:grid-cols-4">
            <div class="relative">
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{{ $t('common.departure') }}</label>
              <CityAutocomplete
                v-model="fromCity"
                :placeholder="$t('search.departurePlaceholder')"
              />
              
              <!-- Swap Cities Button -->
              <button
                type="button"
                @click="swapCities"
                :disabled="!fromCity || !toCity"
                class="absolute -right-5 top-9 z-10 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ArrowLeftRight class="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{{ $t('common.arrival') }}</label>
              <CityAutocomplete
                v-model="toCity"
                :placeholder="$t('search.arrivalPlaceholder')"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{{ $t('common.availability') }}</label>
              <div class="w-full p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-md text-sm text-green-700 dark:text-green-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ $t('search.dailyDepartures') }}
              </div>
            </div>

            <div class="flex items-end">
              <AppButton 
                variant="corail" 
                :label="$t('common.search')"
                type="submit"
                icon="Search"
                :disabled="isSearchDisabled"
              />
            </div>
          </form>
        </div>
      </div>

      <div class="border-b border-gray-200 dark:border-gray-800 hidden md:block"></div>
    </div>

    <!-- Search Form Modal -->
    <SearchFormModal
      v-model:show="showSearchModal"
      :from-city="fromCity"
      :to-city="toCity"
      @submit="handleModalSubmit"
    />

    <!-- Main Content -->
    <div class="flex-1 mt-12 md:mt-0">
      <div class="container mx-auto px-4 py-6">
        <!-- Mobile Filters Modal -->
        <div v-if="shouldShowFilters" class="lg:hidden">
          <SearchFiltersGroupMobile
            v-model:show-modal="showFiltersModal"
            v-model="filters"
            :companies="carCompanies"
            :comfort-categories="comfortCategories"
            :from-city="fromCity"
            @update:modelValue="debouncedFilterSearch"
          />
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Results and Filters Section -->
          <div class="col-span-12 lg:col-span-7">
            <!-- Desktop Filters Section -->
            <SearchFiltersGroup
              v-if="shouldShowFilters"
              v-model="filters"
              :companies="carCompanies"
              :comfort-categories="comfortCategories"
              :from-city="fromCity"
              @update:modelValue="debouncedFilterSearch"
            />

            <div>
              <div v-if="loading" class="text-center py-8">
                <CarLoader />
                <p class="text-gray-500 dark:text-gray-400">{{ $t('results.searchingTrips') }}</p>
              </div>

              <div v-else-if="departures.length === 0">
                <SearchEmptyState
                  :title="$t('results.noResults')"
                  :description="$t('results.noResultsDescription')"
                />
              </div>

              <div v-else-if="departures.length > 0" class="space-y-4">
                <DepartureCard
                  v-for="departure in departures" 
                  :key="departure.id"
                  :departure="departure"
                  @click="departureSelected = departure"
                />

                <div v-if="hasMoreResults" class="flex justify-center mt-8 mb-4">
                  <button 
                    @click="loadMoreResults"
                    :disabled="loadingMore"
                    class="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
                  >
                    <RefreshCcwIcon v-if="loadingMore" class="w-4 h-4 animate-spin" />
                    <span>{{ loadingMore ? $t('common.loading') : $t('common.showMore') }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden lg:block col-span-12 lg:col-span-5">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-light p-4 sticky" style="top: calc(var(--header-height, 64px) + var(--form-height, 88px) + 1.5rem);">
              <div class="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg">
                <!-- Ici viendra la carte -->
                <div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p>{{ $t('results.routeMap') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DepartureDetailSidebar
      v-model="departureSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {  RefreshCcw as RefreshCcwIcon, ChevronLeft, ArrowLeftRight } from 'lucide-vue-next';
import SearchFiltersGroup from './filters/SearchFiltersGroup.vue';
import SearchFiltersGroupMobile from './filters/SearchFiltersGroupMobile.vue';
import CityAutocomplete from './CityAutocomplete.vue';
import CarLoader from './CarLoader.vue';
import DepartureCard from './DepartureCard.vue';
import SearchEmptyState from './SearchEmptyState.vue';
import DepartureDetailSidebar from './DepartureDetailSidebar.vue';
import { carCompanies } from '~/server/data';
import type { Departure } from '~/server/data';
import {  useDebounceFn } from '@vueuse/core';
import { useSearchStore } from '~/stores/search';
import { useRouter } from 'vue-router';
import SearchFormModal from './SearchFormModal.vue';
import { getSlugFromCity } from '~/utils/cities';

const router = useRouter();
const route = useRoute();

const searchStore = useSearchStore();
const loading = ref(true);
const departures = ref<Departure[]>([]);
const showFiltersModal = ref(false);
const departureSelected = ref<Departure | null>(null);
const totalResults = ref(0);
const currentSort = ref('');

const totalPages = ref(0);
const page = ref(1);
const limit = 25;

const { searchCars } = useSecureApi()
  const { isCityValid } = await import('~/utils/cities');

const hasMoreResults = computed(() => {
  return page.value < totalPages.value;
});

const loadingMore = ref(false);

const fromCity = ref(searchStore.from || '');
const toCity = ref(searchStore.to || '');
const hasSearched = ref(false);
const showSearchModal = ref(false);

const lastSearchFrom = ref('');
const lastSearchTo = ref('');

const isFiltering = ref(false);

const filters = ref({
  maxPrice: 50000,
  companies: [] as string[],
  departurePeriod: '',
  comfortCategories: [] as string[],
  commune: ''
});

const comfortCategories = ref(['Ordinaire', 'VIP', 'VVIP']);

const isSearchChanged = computed(() => {
  return fromCity.value !== lastSearchFrom.value || toCity.value !== lastSearchTo.value;
});

const isSearchDisabled = computed(() => {
  return !fromCity.value || !toCity.value || fromCity.value === toCity.value || (!isSearchChanged.value && hasSearched.value) || loading.value;
});

const shouldShowFilters = computed(() => {
  return hasSearched.value && (departures.value.length > 0 || isFiltering.value);
});

const debouncedFilterSearch = useDebounceFn(() => {
  isFiltering.value = true;
  loading.value = true;
  page.value = 1;
  performSearch(true);
}, 500);

const handleSearch = async () => {
  // Désactiver le bouton immédiatement
  loading.value = true;
  await performSearch(false);
};

const handleModalSubmit = async (data: { from: string; to: string }) => {
  // Mettre à jour les villes avec les valeurs du modal
  fromCity.value = data.from;
  toCity.value = data.to;
  // Désactiver le bouton immédiatement
  loading.value = true;
  await performSearch(false);
};

const performSearch = async (isFilteringParam = false) => {
  if (!fromCity.value || !toCity.value || fromCity.value === toCity.value) {
    loading.value = false;
    return;
  }

  if (!isSearchChanged.value && hasSearched.value && !isFilteringParam) {
    loading.value = false;
    return;
  }

  // Loading est déjà à true grâce à handleSearch
  hasSearched.value = true;

  if (!isFilteringParam) {
    isFiltering.value = false;
  }
  
  lastSearchFrom.value = fromCity.value;
  lastSearchTo.value = toCity.value;
  

  
  if (!isCityValid(fromCity.value) || !isCityValid(toCity.value)) {
    await router.push('/destinations-populaires');
    loading.value = false;
    return;
  }
  
  searchStore.setSearchParams({
    type: 'car',
    from: fromCity.value,
    to: toCity.value
  });
  
  const fromSlug = getSlugFromCity(fromCity.value);
  const toSlug = getSlugFromCity(toCity.value);
  const targetPath = `/results/${fromSlug}/${toSlug}`;
  
  // Mettre à jour l'URL seulement si elle est différente
  if (route.path !== targetPath) {
    await router.replace(targetPath);
    // Le watch se déclenchera automatiquement avec les nouveaux params
    return;
  }
  departures.value = [];
  
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  try {
    const response = await searchCars({
      from: getSlugFromCity(fromCity.value),
        to: getSlugFromCity(toCity.value),
        page: page.value,
        limit,
        maxPrice: filters.value.maxPrice,
        companies: [...filters.value.companies],
        departurePeriod: filters.value.departurePeriod,
        comfortCategories: [...filters.value.comfortCategories],
        commune: filters.value.commune,
        sort: currentSort.value
    })
    
    departures.value = response.departures || [];
    totalResults.value = response._meta.total || 0;
    totalPages.value = Math.ceil((response._meta.total || 0) / limit);
    
  } catch (error) {
    console.error('Error searching departures:', error);
    departures.value = [];
    totalResults.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
}

const loadMoreResults = async () => {
  if (loadingMore.value || !hasMoreResults.value) return;
  
  loadingMore.value = true;
  page.value++;
  
  try {
    const response = await searchCars({
      from: getSlugFromCity(fromCity.value),
        to: getSlugFromCity(toCity.value),
        page: page.value,
        limit,
        maxPrice: filters.value.maxPrice,
        companies: [...filters.value.companies],
        departurePeriod: filters.value.departurePeriod,
        comfortCategories: [...filters.value.comfortCategories],
        commune: filters.value.commune,
        sort: currentSort.value
    })
    
    departures.value = [...departures.value, ...(response.departures || [])];
    totalResults.value = response._meta.total || 0;
    totalPages.value = Math.ceil((response._meta.total || 0) / limit);
    
  } catch (error) {
    console.error('Error loading more results:', error);
    page.value--; // Revert page increment on error
  } finally {
    loadingMore.value = false;
  }
}

// Watch sur les paramètres de route pour déclencher la recherche
watch(
  () => ({ from: route.params.from, to: route.params.to }),
  (newParams, oldParams) => {
    const { from: newFrom, to: newTo } = newParams;
    // Mettre à jour les villes depuis l'URL
    if (newFrom && typeof newFrom === 'string') {
      const newFromCity = newFrom.charAt(0).toUpperCase() + newFrom.slice(1);
      if (fromCity.value !== newFromCity) {
        fromCity.value = newFromCity;
      }
    }
    if (newTo && typeof newTo === 'string') {
      const newToCity = newTo.charAt(0).toUpperCase() + newTo.slice(1);
      if (toCity.value !== newToCity) {
        toCity.value = newToCity;
      }
    }
    
    // Faire la recherche si on a les deux villes et qu'elles ont changé
    if (fromCity.value && toCity.value) {
      // Ne rechercher que si les villes ont vraiment changé
      if (fromCity.value !== lastSearchFrom.value || toCity.value !== lastSearchTo.value) {
        lastSearchFrom.value = fromCity.value;
        lastSearchTo.value = toCity.value;
        performSearch();
      }
    }
  },
  { immediate: true }
)

const swapCities = () => {
  const tempFrom = fromCity.value;
  fromCity.value = toCity.value;
  toCity.value = tempFrom;
}

watch(() => currentSort.value, () => {
  debouncedFilterSearch();
});

const seoData = computed(() => {
  const hasSearchData = fromCity.value && toCity.value;
  const hasResults = departures.value.length > 0;
  
  if (hasSearchData) {
    const baseTitle = `${fromCity.value} → ${toCity.value}`;
    const resultCount = totalResults.value;
    
    return {
      title: hasResults 
        ? `${baseTitle} - ${resultCount} trajets disponibles | Geyavo`
        : `${baseTitle} - Recherche de trajets en car | Geyavo`,
      
      description: hasResults
        ? `Trouvez les meilleurs trajets en car de ${fromCity.value} à ${toCity.value}. ${resultCount} options disponibles avec horaires, prix et compagnies. Réservez votre voyage en Côte d'Ivoire.`
        : `Recherchez des trajets en car de ${fromCity.value} à ${toCity.value}. Comparez les prix, horaires et compagnies de transport en Côte d'Ivoire sur Geyavo.`,
      
      keywords: `${fromCity.value}, ${toCity.value}, car, transport, voyage, Côte d'Ivoire, horaires, prix`,
      
      canonical: `/results/${getSlugFromCity(fromCity.value)}/${getSlugFromCity(toCity.value)}`,
      
      ogTitle: hasResults
        ? `${resultCount} trajets ${baseTitle} disponibles`
        : `Trajets en car ${baseTitle}`,
      
      ogDescription: hasResults
        ? `Découvrez ${resultCount} options de voyage de ${fromCity.value} à ${toCity.value}. Comparez et réservez votre trajet.`
        : `Recherchez et comparez les trajets en car de ${fromCity.value} à ${toCity.value} en Côte d'Ivoire.`,
    };
  }
  
  return {
    title: 'Recherche de trajets en car - Geyavo',
    description: 'Trouvez et comparez les meilleurs trajets en car en Côte d\'Ivoire. Réservez votre voyage avec les meilleures compagnies de transport.',
    keywords: 'car, transport, voyage, Côte d\'Ivoire, réservation, trajets',
    canonical: '/results',
    ogTitle: 'Recherche de trajets en car en Côte d\'Ivoire',
    ogDescription: 'Comparez et réservez vos trajets en car en Côte d\'Ivoire avec Geyavo.',
  };
});

useHead(() => ({
  title: seoData.value.title,
  meta: [
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
          name: 'Résultats de recherche de trajets en car',
          description: seoData.value.description,
          ...(fromCity.value && toCity.value && {
            about: {
              '@type': 'Trip',
              name: `Trajet ${fromCity.value} - ${toCity.value}`,
              description: `Voyage en car de ${fromCity.value} à ${toCity.value}`,
              departureLocation: {
                '@type': 'Place',
                name: fromCity.value,
                addressCountry: 'CI'
              },
              arrivalLocation: {
                '@type': 'Place',
                name: toCity.value,
                addressCountry: 'CI'
              }
            }
          })
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
            ...(fromCity.value && toCity.value ? [{
              '@type': 'ListItem',
              position: 3,
              name: `${fromCity.value} → ${toCity.value}`,
              item: `https://geyavo.com${seoData.value.canonical}`
            }] : [])
          ]
        },
        provider: {
          '@type': 'Organization',
          name: 'Geyavo',
          url: 'https://geyavo.com',
          description: 'Plateforme de réservation de trajets en car en Côte d\'Ivoire'
        }
      })
    }
  ]
}));

</script>

<style>
:root {
  --header-height: 64px;
  --form-height: 88px;
}

@media (max-width: 768px) {
  :root {
    --header-height: 0px;
  }
}

/* .shadow-light {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
} */

.result-card {
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(19, 41, 104, 0.2) 0px 2px 5px 0px;
}

.dark .result-card {
  background-color: #2f2f2f;
  box-shadow: rgba(19, 41, 104, 0.2) 0px 2px 5px 0px;
}
</style>