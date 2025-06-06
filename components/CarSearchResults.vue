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
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{{ $t('common.departure') }}</label>
              <CityAutocomplete
                v-model="fromCity"
                @select="handleFromSelect"
                :placeholder="$t('search.departurePlaceholder')"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{{ $t('common.arrival') }}</label>
              <CityAutocomplete
                v-model="toCity"
                @select="handleToSelect"
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
                variant="coral" 
                :label="$t('common.search')"
                type="submit"
                icon="Search"
                :disabled="!fromCity || !toCity"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- Mobile Search Form (visible when no results) -->
      <div v-if="!loading && departures.length === 0" class="md:hidden p-4 bg-white dark:bg-gray-900">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('search.title') }}</h2>
        <form @submit.prevent="handleSearch" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{{ $t('common.departure') }}</label>
            <CityAutocomplete
              v-model="fromCity"
              @select="handleFromSelect"
              :placeholder="$t('search.departurePlaceholder')"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{{ $t('common.arrival') }}</label>
            <CityAutocomplete
              v-model="toCity"
              @select="handleToSelect"
              :placeholder="$t('search.arrivalPlaceholder')"
            />
          </div>
          
          <AppButton 
            variant="coral" 
            :label="$t('common.search')"
            type="submit"
            icon="Search"
            :disabled="!fromCity || !toCity"
            class="w-full"
          />
        </form>
      </div>

      <div class="border-b border-gray-200 dark:border-gray-800 hidden md:block"></div>
    </div>

    <!-- Search Form Modal -->
    <SearchFormModal
      v-model:show="showSearchModal"
      v-model:fromCity="fromCity"
      v-model:toCity="toCity"
      @from-select="handleFromSelect"
      @to-select="handleToSelect"
      @submit="handleSearch"
    />

    <!-- Main Content -->
    <div class="flex-1 mt-12 md:mt-0">
      <div class="container mx-auto px-4 py-6">
        <!-- Mobile Filters Modal -->
        <div v-if="hasSearched && (departures.length > 0 || (fromCity && toCity))" class="lg:hidden">
          <SearchFiltersGroupMobile
            v-model:show-modal="showFiltersModal"
            v-model="filters"
            :companies="carCompanies"
            @update:modelValue="debouncedFilterSearch"
          />
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-12 gap-6">
          <!-- Results and Filters Section -->
          <div class="col-span-12 lg:col-span-7">
            <!-- Desktop Filters Section -->
            <SearchFiltersGroup
              v-if="hasSearched && (departures.length > 0 || (fromCity && toCity))"
              v-model="filters"
              :companies="carCompanies"
              @update:modelValue="debouncedFilterSearch"
            />

            <!-- Results List -->
            <div>
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-8">
                <CarLoader />
                <p class="text-gray-500 dark:text-gray-400">{{ $t('results.searchingTrips') }}</p>
              </div>

              <!-- Results List -->
              <div v-else-if="departures.length > 0" class="space-y-4">
                <DepartureCard
                  v-for="departure in departures" 
                  :key="departure.id"
                  :departure="departure"
                  @click="departureSelected = departure"
                />

                <!-- Load More Button -->
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

              <!-- Empty State -->
              <div v-else>
                <SearchEmptyState
                  :title="$t('results.noResults')"
                  :description="$t('results.noResultsDescription')"
                />
              </div>
            </div>
          </div>

          <!-- Map Section - Hidden on Mobile -->
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

    <!-- Journey Details Sidebar -->
    <DepartureDetailSidebar
      v-model="departureSelected"
    />

    <!-- Session Expired Modal -->
    <SessionExpiredModal
      v-model="showSessionExpiredModal"
      @refresh="refreshSearch"
      @new-search="newSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { FilterIcon, RefreshCcw as RefreshCcwIcon, X as XIcon, ChevronLeft } from 'lucide-vue-next';
import SearchFiltersGroup from './filters/SearchFiltersGroup.vue';
import SearchFiltersGroupMobile from './filters/SearchFiltersGroupMobile.vue';
import CityAutocomplete from './CityAutocomplete.vue';
import CarLoader from './CarLoader.vue';
import DepartureCard from './DepartureCard.vue';
import SearchEmptyState from './SearchEmptyState.vue';
import DepartureDetailSidebar from './DepartureDetailSidebar.vue';
import { carCompanies } from '~/server/data';
import type { Departure } from '~/server/data';
import { ChevronDownIcon, ChevronRightIcon, MapPinIcon, PhoneIcon, Megaphone, CheckCircleIcon } from 'lucide-vue-next';
import SessionExpiredModal from './SessionExpiredModal.vue';
import SortMenu from './SortMenu.vue';
import { useIntersectionObserver, useDebounceFn } from '@vueuse/core';
import { useSearchStore } from '~/stores/search';
import { useRouter } from 'vue-router';
import { capitalizeWords } from '~/utils/string';
import SearchFormModal from './SearchFormModal.vue';

const router = useRouter();
const sessionTimeout = 10 * 60 * 1000; // 10 minutes en millisecondes
let sessionTimer: NodeJS.Timeout | null = null;
const showSessionExpiredModal = ref(false);

const route = useRoute();
const searchStore = useSearchStore();
const loading = ref(false);
const departures = ref<Departure[]>([]);
const expandedJourney = ref<string | null>(null);
const showFiltersModal = ref(false);
const departureSelected = ref<Departure | null>(null);
const totalResults = ref(0);
const currentSort = ref('');

const totalPages = ref(0);
const page = ref(1);
const limit = 25;

const hasMoreResults = computed(() => {
  return page.value < totalPages.value;
});

const loadingMore = ref(false);

const fromCity = ref(searchStore.from || '');
const toCity = ref(searchStore.to || '');
const hasSearched = ref(false); // Variable for tracking if a search has been performed
const showSearchModal = ref(false);

const filters = ref({
  maxPrice: 50000,
  companies: [] as string[],
  departurePeriod: ''
});

const companies = computed(() => carCompanies);

const hasActiveFilters = computed(() => {
  return filters.value.maxPrice !== 50000 || 
         filters.value.companies.length > 0 || 
         filters.value.departurePeriod !== '';
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.maxPrice !== 50000) count++;
  if (filters.value.companies.length > 0) count++;
  if (filters.value.departurePeriod !== '') count++;
  return count;
});

const resetFilters = () => {
  filters.value = {
    maxPrice: 50000,
    companies: [],
    departurePeriod: ''
  };
  // handleSearch();
}

const debouncedFilterSearch = useDebounceFn(() => {
  page.value = 1;
  // currentSort.value = 'price_asc';
  handleSearch();
}, 300);

const handleSearch = async () => {
  if (!fromCity.value || !toCity.value) {
    return;
  }

  hasSearched.value = true; // Mark that a search has been performed
  
  loading.value = true;
  departures.value = [];
  
  try {
    const response = await $fetch('/api/car/search', {
      params: {
        from: normalizeCity(fromCity.value),
        to: normalizeCity(toCity.value),
        page: page.value,
        limit,
        maxPrice: filters.value.maxPrice,
        companies: [...filters.value.companies],
        departurePeriod: filters.value.departurePeriod,
        sort: currentSort.value
      }
    });
    
    departures.value = response.departures || [];
    totalResults.value = response.total || 0;
    totalPages.value = Math.ceil((response.total || 0) / limit);
    
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
    const response = await $fetch('/api/car/search', {
      params: {
        from: normalizeCity(fromCity.value),
        to: normalizeCity(toCity.value),
        page: page.value,
        limit,
        maxPrice: filters.value.maxPrice,
        companies: [...filters.value.companies],
        departurePeriod: filters.value.departurePeriod,
        sort: currentSort.value
      }
    });
    
    departures.value = [...departures.value, ...(response.departures || [])];
    totalResults.value = response.total || 0;
    totalPages.value = Math.ceil((response.total || 0) / limit);
    
  } catch (error) {
    console.error('Error loading more results:', error);
    page.value--; // Revert page increment on error
  } finally {
    loadingMore.value = false;
  }
}

// Trigger search on component mount
 onMounted(() => {
  if (fromCity.value && toCity.value) {
    handleSearch();
  }
  
  // Initialiser le timer
  resetSessionTimer();
  
  // Ajouter les écouteurs d'événements
  window.addEventListener('mousemove', handleUserActivity);
  window.addEventListener('keypress', handleUserActivity);
  window.addEventListener('click', handleUserActivity);
  window.addEventListener('scroll', handleUserActivity);
})

onUnmounted(() => {
  // Nettoyer le timer et les écouteurs
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
  window.removeEventListener('mousemove', handleUserActivity);
  window.removeEventListener('keypress', handleUserActivity);
  window.removeEventListener('click', handleUserActivity);
  window.removeEventListener('scroll', handleUserActivity);
})

// Fonction pour réinitialiser le timer
const resetSessionTimer = () => {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
  sessionTimer = setTimeout(() => {
    showSessionExpiredModal.value = true;
  }, sessionTimeout);
}

// Fonction pour rafraîchir la recherche
const refreshSearch = () => {
  showSessionExpiredModal.value = false;
  handleSearch();
  resetSessionTimer();
}

// Fonction pour nouvelle recherche
const newSearch = () => {
  showSessionExpiredModal.value = false;
  searchStore.$reset();
  // router.push('/results');
}

// Écouter les interactions utilisateur pour réinitialiser le timer
function handleUserActivity() {
  resetSessionTimer();
}

const handleFromSelect = (city: any) => {
  searchStore.setSearchParams({
    from: city.name
  });
}

const handleToSelect = (city: any) => {
  searchStore.setSearchParams({
    to: city.name
  });
}

// Surveiller les changements dans le store
// watch(() => [searchStore.from, searchStore.to], ([newFrom, newTo]) => {
//   fromCity.value =  newFrom || '';
//   toCity.value =  newTo || '';
//   if (fromCity.value && toCity.value) {
//     debouncedFilterSearch();
//   }
// });

// Surveiller les changements dans les filtres
// watch(() => filters.value, () => {
//   debouncedFilterSearch();
// }, { deep: true });

// surveiller le sort
watch(() => currentSort.value, () => {
  debouncedFilterSearch();
});

// SEO
useHead({
  title: 'Recherche de Cars - VoyagezCi',
  meta: [
    {
      name: 'description',
      content: 'Résultats de recherche pour les trajets en car'
    }
  ]
});

// Types
type DeparturePeriod = '' | 'morning' | 'afternoon' | 'evening';

const departurePeriods = {
  '': 'Toute heure',
  'morning': 'Matin (5h - 12h)',
  'afternoon': 'Après-midi (12h - 18h)',
  'evening': 'Soir (18h - 00h)'
} as const;

const handleMobileSearch = () => {
  handleSearch();
  showSearchModal.value = false;
}
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

.shadow-light {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.result-card {
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(19, 41, 104, 0.2) 0px 2px 5px 0px;
}

.dark .result-card {
  background-color: #2f2f2f;
  box-shadow: rgba(19, 41, 104, 0.2) 0px 2px 5px 0px;
}
</style>