<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Minimalist Search Section -->
    <div class="bg-white rounded-xl shadow-light p-6 mb-8">
      <form @submit.prevent="handleSearch" class="grid gap-4 md:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">Départ</label>
          <CityAutocomplete
            v-model="searchParams.from"
            type="origin"
            placeholder="Ville de départ"
            class="w-full"
            @update:modelValue="handleSearch"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">Arrivée</label>
          <CityAutocomplete
            v-model="searchParams.to"
            type="destination"
            placeholder="Ville d'arrivée"
            class="w-full"
            @update:modelValue="handleSearch"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-2">Disponibilité</label>
          <div class="w-full p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Départs disponibles tous les jours
          </div>
        </div>
      </form>
    </div>

    <!-- Mobile Filter Button -->
    <div class="md:hidden mb-4">
      <button 
        @click="showFiltersModal = true"
        class="w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg flex items-center justify-between shadow-sm hover:bg-gray-50"
      >
        <div class="flex items-center">
          <FilterIcon class="w-4 h-4 mr-2 text-gray-500" />
          <span>Filtres</span>
        </div>
        <div class="flex items-center">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
            {{ activeFiltersCount }}
          </span>
        </div>
      </button>
    </div>

    <!-- Mobile Filters Modal -->
    <div 
      v-if="showFiltersModal" 
      class="fixed inset-0 z-50 overflow-y-auto bg-black/50 md:hidden"
      @click.self="showFiltersModal = false"
    >
      <div 
        class="bg-white w-full rounded-t-xl absolute bottom-0 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-800">Filtres</h3>
            <div class="flex items-center gap-4">
              <button 
                v-if="hasActiveFilters"
                @click="resetFilters"
                class="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                <RefreshCcwIcon class="w-4 h-4 mr-1" />
                Réinitialiser
              </button>
              <button 
                @click="showFiltersModal = false"
                class="text-gray-600 hover:text-gray-800"
              >
                <XIcon class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Price Filter -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-600 mb-2">
              Prix Maximum (FCFA)
            </label>
            <input 
              type="range" 
              v-model="filters.maxPrice" 
              min="0" 
              max="50000" 
              step="1000"
              class="w-full"
            >
            <div class="text-sm text-gray-600 mt-2 text-left">
              {{ filters.maxPrice.toLocaleString() }} FCFA
            </div>
          </div>

          <!-- Companies Filter -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-600 mb-3">Compagnies</h4>
            <div class="grid grid-cols-2 gap-2">
              <label 
                v-for="company in companies" 
                :key="company.id"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  v-model="filters.selectedCompanies"
                  :value="company.id"
                  class="rounded text-primary-600 focus:ring-primary-500"
                >
                <span class="ml-2 text-sm text-gray-700">{{ company.name }}</span>
              </label>
            </div>
          </div>

          <!-- Departure Time Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">
              Heure de Départ
            </label>
            <select 
              v-model="filters.departureTime" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500"
            >
              <option value="">Toute heure</option>
              <option value="morning">Matin (6h - 12h)</option>
              <option value="afternoon">Après-midi (12h - 18h)</option>
              <option value="evening">Soir (18h - 00h)</option>
            </select>
          </div>

          <button 
            @click="showFiltersModal = false"
            class="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>

    <!-- Results Container -->
    <div class="grid md:grid-cols-12 gap-6">
      <!-- Desktop Filters -->
      <div class="md:col-span-4 hidden md:block">
        <div class="bg-white rounded-xl shadow-light p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Filtres</h3>
            <button 
              v-if="hasActiveFilters"
              @click="resetFilters"
              class="text-sm text-gray-600 hover:text-gray-800 flex items-center"
            >
              <RefreshCcwIcon class="w-4 h-4 mr-1" />
              Réinitialiser
            </button>
          </div>
          
          <!-- Price Filter -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-600 mb-2">
              Prix Maximum (FCFA)
            </label>
            <input 
              type="range" 
              v-model="filters.maxPrice" 
              min="0" 
              max="50000" 
              step="1000"
              class="w-full"
            >
            <div class="text-sm text-gray-600 mt-2 text-left">
              {{ filters.maxPrice.toLocaleString() }} FCFA
            </div>
          </div>

          <!-- Companies Filter -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-600 mb-3">Compagnies</h4>
            <div class="space-y-2">
              <label 
                v-for="company in companies" 
                :key="company.id"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  v-model="filters.selectedCompanies"
                  :value="company.id"
                  class="rounded text-primary-600 focus:ring-primary-500"
                >
                <span class="ml-2 text-sm text-gray-700">{{ company.name }}</span>
              </label>
            </div>
          </div>

          <!-- Departure Time Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">
              Heure de Départ
            </label>
            <select 
              v-model="filters.departureTime" 
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500"
            >
              <option value="">Toute heure</option>
              <option value="morning">Matin (6h - 12h)</option>
              <option value="afternoon">Après-midi (12h - 18h)</option>
              <option value="evening">Soir (18h - 00h)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results List -->
      <div class="md:col-span-8 col-span-full">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <CarLoader />
          <p class="text-gray-500">Recherche des voyages disponibles...</p>
        </div>

        <!-- Results -->
        <div v-else-if="filteredDepartures.length > 0" class="space-y-4">
          <div 
            v-for="departure in filteredDepartures" 
            :key="departure.id" 
            :class="[
              'bg-white rounded-xl p-6 transition-all duration-200 cursor-pointer relative',
              departureSelected?.id === departure.id 
                ? 'ring-2 ring-primary-500 shadow-lg bg-primary-50'
                : 'shadow-light hover:shadow-md hover:scale-[1.02]'
            ]"
            @click="departureSelected = departure"
          >
          <pre>{{ totalPages }} / {{ filteredDepartures.length }} / {{ page }}</pre>
            <div class="flex flex-col">
              <!-- En-tête avec opérateur et prix -->
              <div class="flex justify-between items-center mb-6">
                <div class="flex items-center">
                  <img 
                    :src="departure.company.logo_url" 
                    :alt="departure.company.name" 
                    class="h-8 w-8 mr-3 object-contain"
                  />
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ departure.company.name }}
                  </h3>
                </div>
                <div class="hidden sm:block">
                  <p class="text-lg font-bold text-primary-600">
                    {{ departure.price.toLocaleString() }} FCFA
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-500">Départ</p>
                  <p class="font-medium">{{ formatTime(departure.departure_time) }}</p>
                  <p class="text-sm text-gray-600">{{ departure.origin }}</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-gray-500">Durée (estimée)</p>
                  <p class="font-medium">{{ departure.duration }}</p>
                  <div class="border-t border-gray-200 my-1"></div>
                  <p class="text-xs text-gray-400">* Temps approximatif</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">Arrivée</p>
                  <p class="font-medium">{{ formatTime(departure.arrival_time) }}</p>
                  <p class="text-sm text-gray-600">{{ departure.destination }}</p>
                </div>
              </div>

              <div class="block sm:hidden">
                <p class="text-lg font-bold text-primary-600 text-center">
                  {{ departure.price.toLocaleString() }} FCFA
                </p>
              </div>
            </div>
          </div>

          <!-- Infinite Scroll Trigger -->
        <div 
          ref="loadMoreTrigger"
          v-if="hasMoreResults"
          class="py-4 text-center"
        >

        <div v-if="loadingMore" class="text-center py-8">
          <CarLoader />
          <p class="text-gray-500">Recherche des voyages disponibles...</p>
        </div>
          <!-- <CarLoader v-if="loadingMore" />
          <p v-else class="text-gray-500 text-sm">Chargement de plus de résultats...</p> -->
        </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg 
            class="mx-auto h-16 w-16 text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="1" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 class="mt-4 text-lg font-semibold text-gray-600">
            Aucun trajet trouvé
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            Ajustez vos critères de recherche pour trouver un trajet.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Journey Details Modal/Sidebar -->
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="departureSelected"
      class="fixed inset-0 bg-black bg-opacity-25 z-50"
      @click="departureSelected = null"
    >
      <Transition
        enter-active-class="transform transition ease-out duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition ease-in duration-200"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          class="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl z-[60] overflow-y-auto"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-[70] shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800">Détails du trajet</h3>
            <button
              @click="departureSelected = null"
              class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <div v-if="departureSelected" class="space-y-6">
              <!-- Operator Info -->
              <div class="flex items-center">
                <img
                  :src="departureSelected.company.logo_url"
                  :alt="departureSelected.company.name"
                  class="h-12 w-12 mr-4 object-contain"
                />
                <div>
                  <h4 class="font-semibold text-gray-800">{{ departureSelected.company.name }}</h4>
                  <p class="text-primary-600 font-bold">{{ departureSelected.price.toLocaleString() }} FCFA</p>
                </div>
              </div>

              <!-- Journey Times -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <p class="text-xs text-gray-500">Départ</p>
                    <p class="font-medium">{{ formatTime(departureSelected.departure_time) }}</p>
                    <p class="text-sm text-gray-600">{{ departureSelected.origin }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-xs text-gray-500">Durée</p>
                    <p class="font-medium">{{ departureSelected.duration }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">Arrivée</p>
                    <p class="font-medium">{{ formatTime(departureSelected.arrival_time) }}</p>
                    <p class="text-sm text-gray-600">{{ departureSelected.destination }}</p>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div>
                <h4 class="font-semibold mb-3 text-gray-700">Informations de contact</h4>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li class="flex items-center">
                    <MapPinIcon class="w-5 h-5 mr-2 text-gray-400" />
                    {{ departureSelected.company.address }}
                  </li>
                  <li class="flex items-center">
                    <PhoneIcon class="w-5 h-5 mr-2 text-gray-400" />
                    {{ departureSelected.company.contact }}
                  </li>
                  <li class="flex items-center">
                    <Megaphone class="w-5 h-5 mr-2 text-gray-400" />
                    {{ departureSelected.company.email }}
                  </li>
                </ul>
              </div>

              <!-- Services -->
              <div>
                <h4 class="font-semibold mb-3 text-gray-700">Services</h4>
                <ul class="grid grid-cols-2 gap-3">
                  <li
                    v-for="service in departureSelected.company.services"
                    :key="service"
                    class="flex items-center text-sm text-gray-600"
                  >
                    <CheckCircleIcon class="w-5 h-5 mr-2 text-green-500" />
                    {{ service }}
                  </li>
                </ul>
              </div>

              <!-- Book Button -->
              <button
                class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Réserver ce trajet
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { carCompanies } from '~/server/data';
import type { CarJourney } from '~/server/data';
import { ChevronDownIcon, FilterIcon, XIcon, CheckIcon, ChevronRightIcon, MapPinIcon, PhoneIcon, Megaphone, CheckCircleIcon, RefreshCcwIcon } from 'lucide-vue-next';
import CarLoader from './CarLoader.vue';
import { useIntersectionObserver } from '@vueuse/core';

const ITEMS_PER_PAGE = 6;

const route = useRoute();
const loading = ref(false);
const departures = ref<CarJourney[]>([]);
const expandedJourney = ref<string | null>(null);
const showFiltersModal = ref(false);
const departureSelected = ref<CarJourney | null>(null);

const totalPages = ref(0);
const page = ref(1);
const limit = ITEMS_PER_PAGE; // Nombre d'éléments par page

const hasMoreResults = computed(() => {
  return page.value < totalPages.value;
});

const loadingMore = ref(false);

const searchParams = ref({
  from: route.query.from as string || '',
  to: route.query.to as string || '',
});

const filters = ref({
  maxPrice: 10000,
  selectedCompanies: [] as string[],
  departureTime: ''
});

const companies = computed(() => carCompanies);

const filteredDepartures = computed(() => {
  // Existing filtering logic remains the same
  return departures.value.filter(departure => {
    // Price filter
    if (departure.price > filters.value.maxPrice) return false;
    
    // Company filter
    if (filters.value.selectedCompanies.length > 0 && 
        !filters.value.selectedCompanies.includes(departure.company.id)) {
      return false;
    }
    
    // Departure time filter
    if (filters.value.departureTime) {
      const hour = parseInt(departure.departure_time.split(':')[0]);
      if (filters.value.departureTime === 'morning' && (hour < 6 || hour >= 12)) return false;
      if (filters.value.departureTime === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (filters.value.departureTime === 'evening' && (hour < 18)) return false;
    }
    
    return true;
  });
});

const hasActiveFilters = computed(() => {
  return filters.value.maxPrice !== 10000 || 
         filters.value.selectedCompanies.length > 0 || 
         filters.value.departureTime !== '';
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.maxPrice !== 50000) count++;
  if (filters.value.selectedCompanies.length > 0) count++;
  if (filters.value.departureTime !== '') count++;
  return count;
});

const toggleJourneyDetails = (journeyId: string) => {
  expandedJourney.value = expandedJourney.value === journeyId ? null : journeyId;
};

// Intersection observer for infinite scroll
const loadMoreTrigger = ref(null);


useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
  console.log('loadMoreTrigger', loadMoreTrigger.value);
  console.log('isIntersecting', isIntersecting);
  
  if (isIntersecting) {
    loadMoreResults();
  }
});

const loadMoreResults = async () => {
  if (loadingMore.value || !hasMoreResults.value) return;

  if (page.value < totalPages.value) {
    page.value++;
    loadingMore.value = true;
    try {
      await handleSearch();
    } finally {
      loadingMore.value = false;
    }
  }
};

const handleSearch = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/car/search', {
      params: {
        ...searchParams.value,
        page: page.value,
        limit
      }
    });

    console.log('departures', departures.value);

    departures.value = [...departures.value, ...response.departures as CarJourney[]];
    totalPages.value = response.totalPages;
    // totalPages.value = Math.ceil(response.total / limit);
    
  } catch (error) {
    console.error('Error fetching departures:', error);
    departures.value = [];
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

const formatTime = (time: string) => {
  const [hour, minute] = time.split(':');
  return `${hour}:${minute}`;
};

const resetFilters = () => {
  filters.value.maxPrice = 10000;
  filters.value.selectedCompanies = [];
  filters.value.departureTime = '';
};

// TO DO
// mise à jour du formulaire de recherche
watch(searchParams, async ( newValue, oldValue) => {
  page.value = 1;
  await handleSearch();
})

// Initial search
onMounted(async () => {
  if (searchParams.value.from && searchParams.value.to) {
    await handleSearch();
  }
});

// SEO
useHead({
  title: 'Recherche de Cars - VoyagezCi',
  meta: [
    {
      name: 'description',
      content: 'Trouvez et comparez les meilleurs trajets en car en Côte d\'Ivoire'
    }
  ]
});
</script>

<style scoped>
/* Existing styles plus smooth modal transition */
.shadow-light {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
</style>