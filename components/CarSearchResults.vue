<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Search Form -->
    <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
      <form @submit.prevent="handleSearch" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Départ</label>
          <CityAutocomplete
            v-model="searchParams.from"
            type="origin"
            placeholder="Ville de départ"
            @update:modelValue="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Arrivée</label>
          <CityAutocomplete
            v-model="searchParams.to"
            type="destination"
            placeholder="Ville d'arrivée"
            @update:modelValue="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Date</label>
          <input
            v-model="searchParams.date"
            type="date"
            class="input-field"
            @change="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Passagers</label>
          <select
            v-model="searchParams.passengers"
            class="input-field"
            @change="handleSearch"
          >
            <option v-for="n in 9" :key="n" :value="n">{{ n }} {{ n === 1 ? 'passager' : 'passagers' }}</option>
          </select>
        </div>
      </form>
    </div>

    <!-- Results Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Filters Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium mb-4">Filtres</h3>
          
          <!-- Prix Maximum -->
          <div class="mb-4">
            <h4 class="font-medium mb-2 text-sm text-gray-600">Prix Maximum</h4>
            <div class="space-y-2">
              <input 
                type="range" 
                v-model="filters.maxPrice" 
                min="0" 
                max="50000" 
                step="1000"
                class="w-full"
              >
              <div class="text-sm text-gray-600">
                Max: {{ filters.maxPrice.toLocaleString() }} FCFA
              </div>
            </div>
          </div>

          <!-- Compagnies -->
          <div class="mb-4">
            <h4 class="font-medium mb-2 text-sm text-gray-600">Compagnies</h4>
            <div class="space-y-2">
              <label 
                v-for="company in companies" 
                :key="company.id"
                class="flex items-start"
              >
                <input
                  type="checkbox"
                  v-model="filters.selectedCompanies"
                  :value="company.id"
                  class="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <div class="ml-3">
                  <span class="text-sm text-gray-600">{{ company.name }}</span>
                  <p class="text-xs text-gray-500">{{ company.services.length }} services disponibles</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Heure de Départ -->
          <div class="mb-4">
            <h4 class="font-medium mb-2 text-sm text-gray-600">Heure de Départ</h4>
            <select v-model="filters.departureTime" class="input-field text-sm">
              <option value="">Toute heure</option>
              <option value="morning">Matin (6h - 12h)</option>
              <option value="afternoon">Après-midi (12h - 18h)</option>
              <option value="evening">Soir (18h - 00h)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results List -->
      <div class="lg:col-span-3">
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-sm text-gray-600">Recherche des meilleurs trajets...</p>
        </div>

        <div v-else-if="filteredJourneys.length > 0" class="space-y-4">
          <div v-for="journey in filteredJourneys" :key="journey.id" 
               class="bg-white rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="flex-shrink-0">
                    <img :src="journey.operator.logo" :alt="journey.operator.name" class="h-8">
                  </div>
                  <div>
                    <h3 class="text-lg font-medium">{{ journey.operator.name }}</h3>
                  </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <p class="text-xs text-gray-500">Départ</p>
                    <p class="font-medium">{{ journey.departureTime }}</p>
                    <p class="text-sm">{{ journey.origin }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-xs text-gray-500">Durée</p>
                    <p class="font-medium">{{ journey.duration }}</p>
                    <div class="relative">
                      <div class="border-t border-gray-200 absolute w-full top-1/2"></div>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">Arrivée</p>
                    <p class="font-medium">{{ journey.arrivalTime }}</p>
                    <p class="text-sm">{{ journey.destination }}</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-end">
                <p class="text-lg font-medium text-primary-600">{{ journey.price.toLocaleString() }} FCFA</p>
                <button 
                  @click="expandedJourney = expandedJourney === journey.id ? null : journey.id"
                  class="text-primary-600 hover:text-primary-700 text-sm mt-2 flex items-center"
                >
                  {{ expandedJourney === journey.id ? 'Masquer' : 'Détails' }}
                  <svg 
                    class="w-4 h-4 ml-1 transform transition-transform"
                    :class="{ 'rotate-180': expandedJourney === journey.id }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Company Details -->
            <div 
              v-if="expandedJourney === journey.id"
              class="mt-4 pt-4 border-t border-gray-100"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium mb-2">Informations de la compagnie</h4>
                  <ul class="space-y-2 text-sm">
                    <li class="flex items-start">
                      <span class="text-gray-600 mr-2">Adresse:</span>
                      <span>{{ journey.operator.address }}</span>
                    </li>
                    <li class="flex items-start">
                      <span class="text-gray-600 mr-2">Téléphone:</span>
                      <span>{{ journey.operator.phone }}</span>
                    </li>
                    <li class="flex items-start">
                      <span class="text-gray-600 mr-2">Email:</span>
                      <span>{{ journey.operator.email }}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium mb-2">Services à bord</h4>
                  <ul class="grid grid-cols-2 gap-2 text-sm">
                    <li v-for="service in journey.operator.services" :key="service" 
                        class="flex items-center text-gray-600">
                      <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      {{ service }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EmptyState
          v-else
          title="Aucun trajet trouvé"
          description="Essayez de modifier vos critères de recherche pour trouver un trajet."
          image="/images/empty-search.svg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { carCompanies } from '~/server/data';
import type { CarJourney } from '~/server/data';

const route = useRoute();
const loading = ref(false);
const journeys = ref<CarJourney[]>([]);
const expandedJourney = ref<string | null>(null);

const searchParams = ref({
  from: route.query.from as string || '',
  to: route.query.to as string || '',
  date: route.query.date as string || '',
  passengers: Number(route.query.passengers) || 1
});

const filters = ref({
  maxPrice: 50000,
  selectedCompanies: [] as string[],
  departureTime: ''
});

const companies = computed(() => carCompanies);

const filteredJourneys = computed(() => {
  return journeys.value.filter(journey => {
    // Filter by price
    if (journey.price > filters.value.maxPrice) return false;
    
    // Filter by company
    if (filters.value.selectedCompanies.length > 0 && 
        !filters.value.selectedCompanies.includes(journey.operator.id)) {
      return false;
    }
    
    // Filter by departure time
    if (filters.value.departureTime) {
      const hour = parseInt(journey.departureTime.split(':')[0]);
      if (filters.value.departureTime === 'morning' && (hour < 6 || hour >= 12)) return false;
      if (filters.value.departureTime === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (filters.value.departureTime === 'evening' && (hour < 18)) return false;
    }
    
    return true;
  });
});

const handleSearch = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/car/search', {
      params: searchParams.value
    });
    journeys.value = response as CarJourney[];
  } catch (error) {
    console.error('Error fetching journeys:', error);
    journeys.value = [];
  } finally {
    loading.value = false;
  }
};

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