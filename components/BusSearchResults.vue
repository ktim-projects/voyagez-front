<template>
  <div class="min-h-[calc(100vh-4rem)] relative dark:bg-gray-950">
    <div class="grid grid-cols-1 md:grid-cols-12 h-full">
      <!-- Mobile Header -->
      <div class="bg-primary-600 md:hidden fixed top-0 left-0 right-0 z-50 shadow-md">
        <div class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <NuxtLink to="/" class="text-white">
                <ChevronLeft class="w-5 h-5" />
              </NuxtLink>
              <div v-if="selectedRoute" class="text-white font-medium">
                {{ $t('busSearch.line') }} {{ busNumber }}
                <span v-if="selectedRoute.isExpress" class="ml-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                  {{ $t('busSearch.express') }}
                </span>
              </div>
              <div v-else class="text-white font-medium">
                {{ $t('busSearch.title') }}
              </div>
            </div>
            <AppButton 
              v-if="routes.length > 0"
              variant="outline" 
              size="small"
              :label="$t('busSearch.modify')"
              :fullWidth="false"
              class="!text-white !border-white hover:!bg-white/10"
              @click="showSearchModal = true"
            />
          </div>
        </div>
      </div>
      
      <!-- Left Panel -->
      <div class="md:col-span-5 lg:col-span-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto h-[calc(100vh-4rem)] pt-14 md:pt-0">
        <!-- Search Form (visible on desktop or mobile when no results) -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700" :class="{'hidden md:block': routes.length > 0}">
          <form @submit.prevent="searchRoute" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('busSearch.busNumber') }}</label>
                <input
                  v-model="busNumber"
                  type="text"
                  class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  :placeholder="$t('busSearch.busNumberPlaceholder')"
                />
              </div>
            <AppButton type="submit" variant="coral" :label="$t('busSearch.searchButton')" :disabled="!isFormValid" />
          </form>
        </div>

        <!-- Results -->
        <div class="p-6 pb-20">
          <div v-if="loading" class="text-center py-8">
            <BusLoader />
            <p class="text-gray-500 dark:text-gray-400 mt-2">{{ $t('busSearch.searchingMessage') }}</p>
          </div>

          <template v-else>
            <!-- Affichage des itinéraires -->
            <div v-if="routes.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                {{ $t('busSearch.line') }} {{ busNumber }}
                <span v-if="selectedRoute && selectedRoute.isExpress" class="ml-2 text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full hidden md:inline-block">
                  {{ $t('busSearch.express') }}
                </span>
                <span v-if="lineTags.charge" class="ml-2 text-sm bg-coral-100 dark:bg-coral-900 text-coral-700 dark:text-coral-300 px-2 py-0.5 rounded-full">
                  {{ lineTags.charge }}
                </span>
              </h3>
              <!-- Informations sur l'itinéraire sélectionné -->
              <div v-if="selectedRoute" class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 class="font-medium text-gray-800 dark:text-white">
                  {{ selectedRoute.name }}
                </h4>
                <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <div v-if="selectedRoute.stops.length > 0" class="flex items-center">
                    <span class="font-medium mr-1">{{ $t('busSearch.routeInfo.origin') }}:</span> 
                    {{ selectedRoute.stops[0].name }}
                  </div>
                  <div v-if="selectedRoute.stops.length > 1" class="flex items-center mt-1">
                    <span class="font-medium mr-1">{{ $t('busSearch.routeInfo.destination') }}:</span> 
                    {{ selectedRoute.stops[selectedRoute.stops.length - 1].name }}
                  </div>
                  <div class="mt-1">
                    <span class="font-medium mr-1">{{ $t('busSearch.routeInfo.stopsCount') }}:</span> 
                    {{ selectedRoute.stops.length }}
                  </div>
                  <div v-if="selectedRoute.duration" class="mt-1 flex items-center">
                    <span class="font-medium mr-1">{{ $t('busSearch.routeInfo.duration') }}:</span>
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ formatDuration(selectedRoute.duration) }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- Sélection d'itinéraire s'il y en a plusieurs -->
              <div v-if="routes.length > 1" class="mb-6">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ $t('busSearch.selectRoute') }}</p>
                <div class="relative">
                  <select 
                    v-model="selectedRouteId" 
                    @change="handleRouteChange"
                    class="w-full px-4 py-2 pr-10 rounded-md text-sm font-normal bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent appearance-none truncate"
                  >
                    <option 
                      v-for="route in routes" 
                      :key="route.id" 
                      :value="route.id"
                    >
                      {{ route.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <!-- Affichage des arrêts de l'itinéraire sélectionné -->
              <div v-if="selectedRoute" class="mt-4">
                <div class="flex items-center mb-4">
                  <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: selectedRoute.color }"></div>
                  <h4 class="text-md font-medium text-gray-800 dark:text-white">{{ $t('busSearch.stops') }}</h4>
                </div>
                <BusRouteStopsList 
                  :stops="selectedRoute.stops" 
                  :route-color="selectedRoute.color" 
                />
              </div>
            </div>
            <EmptyState
              v-else
              :title="$t('busSearch.noResults')"
              :description="$t('busSearch.noResultsDescription')"
              image="/images/empty-search.svg"
              class="dark:text-white"
            />
          </template>
        </div>
      </div>
      <!-- Map (Desktop only) -->
      <div class="hidden md:block md:col-span-7 lg:col-span-8 relative h-[calc(100vh-4rem)]">
        <div ref="mapContainer" class="absolute inset-0 z-0"></div>
      </div>
    </div>
  </div>
  <!-- Search Form Modal -->
  <BusSearchModal
    v-model:show="showSearchModal"
    v-model:busNumber="modalBusNumber"
    @search="handleModalSearch"
  />
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { BusLine } from '~/server/data/mockData';
import { LineData } from '~/modules/bus/models/line_data';
import { getAllRoutesInfo } from '~/modules/bus/utils/route-utils';
import { displayRouteMap } from '~/modules/bus/utils/map-utils';
import { ChevronLeft, X as XIcon } from 'lucide-vue-next';
import { useSearchStore } from '~/stores/search';

const searchStore = useSearchStore();

const lines = ref<BusLine[]>([]);
const busNumber = ref(searchStore.busNumber || '');
const modalBusNumber = ref('');
const loading = ref(false);
const lastSearchedBusNumber = ref(''); // Pour suivre le dernier numéro de bus recherché
const isFormValid = computed(() => busNumber.value.trim() !== '' && busNumber.value !== lastSearchedBusNumber.value);
const routes = ref<any[]>([]);
const selectedRouteId = ref<number | null>(null);
const mapContainer = ref<HTMLDivElement | null>(null);
const map = ref<L.Map | null>(null);
const lineTags = ref<Record<string, string>>({});
const showSearchModal = ref(false);

// Centre d'Abidjan
const ABIDJAN_CENTER: [number, number] = [5.3599, -4.0083];

// Fonction pour rechercher une ligne de bus
const searchRoute = async () => {
  if (!isFormValid.value) return;
  
  try {
    loading.value = true;
    routes.value = [];
    selectedRouteId.value = null;
    
    // Réinitialiser la carte si elle existe
    if (map.value) {
      map.value.remove();
      map.value = null;
    }
    
    // Appel à l'API combinée qui récupère toutes les données en une seule requête
    const response = await fetch(`/api/bus/line-details?ref=${busNumber.value.trim()}`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la recherche: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Réponse de l\'API combinée:', data);
    
    // Traiter les données directement
    if (data && data.lineId && data.details) {
      console.log('ID de la ligne:', data.lineId);
      console.log('Tags de la ligne:', data.lineTags);
      
      // Stocker les tags de la ligne
      lineTags.value = data.lineTags || {};
      
      // Utiliser la classe LineData pour le traitement des données
      // en passant directement les données déjà récupérées
      const lineData = new LineData();
      const result = lineData.initFromData(data.details, data.lineId);
      console.log('Résultat de l\'initialisation:', result);
      
      // Récupérer les informations sur les itinéraires
      const trips = lineData.getTrips();
      routes.value = getAllRoutesInfo(trips);
      
      if (routes.value.length > 0) {
        selectedRouteId.value = routes.value[0].id;
        // Initialiser la carte avec le premier itinéraire
        nextTick(() => {
          updateMap();
        });
      }
      
      console.log('Routes:', routes.value);
    } else {
      console.error('Données incomplètes dans la réponse');
    }
    
    lastSearchedBusNumber.value = busNumber.value; // Mettre à jour le dernier numéro recherché
    
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
  } finally {
    loading.value = false;
  }
}

// Fonction pour gérer le changement d'itinéraire dans le menu déroulant
const handleRouteChange = () => {
  if (selectedRouteId.value !== null) {
    selectRoute(selectedRouteId.value);
  }
};

// Sélectionner un itinéraire
const selectRoute = (routeId: number) => {
  selectedRouteId.value = routeId;
  // Mettre à jour la carte quand on change d'itinéraire
  nextTick(() => {
    updateMap();
  });
}

// Obtenir l'itinéraire sélectionné
const selectedRoute = computed(() => {
  if (!selectedRouteId.value) return null;
  return routes.value.find(route => route.id === selectedRouteId.value) || null;
});

// Type pour les arrêts
interface Stop {
  id: string | number | undefined;
  name: string;
  coordinates: [number, number] | null;
}

// Fonction pour formater la durée en heures et minutes
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  
  return `${mins} min`;
};

// Mettre à jour la carte avec l'itinéraire sélectionné
const updateMap = () => {
  if (!mapContainer.value) return;
  
  // Supprimer la carte existante si elle existe
  if (map.value) {
    map.value.remove();
  }
  
  if (selectedRoute.value) {
    // Afficher la nouvelle carte avec l'itinéraire sélectionné
    const route = selectedRoute.value;
    map.value = displayRouteMap(
      mapContainer.value,
      route.shape,
      route.stops.map((stop: Stop) => {
        // Convertir les arrêts en format GeoJSON pour la carte
        if (stop.coordinates) {
          return {
            id: stop.id,
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: stop.coordinates
            },
            properties: {
              name: stop.name
            }
          };
        }
        return null;
      }).filter(Boolean),
      route.color
    );
  }
}

// Initialiser la carte par défaut
const initDefaultMap = () => {
  if (!mapContainer.value || map.value) return;
  
  // Initialiser la carte centrée sur Abidjan
  map.value = L.map(mapContainer.value).setView(ABIDJAN_CENTER, 12);
  
  // Ajouter la couche de tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.7
  }).addTo(map.value);
  
  // Ajouter l'échelle
  L.control.scale().addTo(map.value);
}

// Fonction pour gérer la recherche depuis la modal
const handleModalSearch = () => {
  if (modalBusNumber.value.trim() !== '' && modalBusNumber.value !== lastSearchedBusNumber.value) {
    busNumber.value = modalBusNumber.value;
    showSearchModal.value = false;
    searchRoute();
  } else {
    showSearchModal.value = false;
  }
};

// Initialiser la carte au montage du composant
onMounted(() => {
  initDefaultMap();
  
  // Déclencher automatiquement la recherche si un numéro de bus est fourni dans le store
  if (searchStore.busNumber) {
    searchRoute();
  }
});

// Observer les changements de l'itinéraire sélectionné pour mettre à jour la carte
watch(selectedRoute, () => {
  updateMap();
});

// Lorsque la modal s'ouvre, initialiser le numéro de bus
watch(showSearchModal, (newValue) => {
  if (newValue) {
    modalBusNumber.value = busNumber.value;
  }
});

// SEO
useHead({
  title: 'Recherche de Bus - VoyagezCi',
  meta: [
    {
      name: 'description',
      content: 'Trouvez votre itinéraire en bus à Abidjan'
    }
  ]
});
</script>

<style scoped>
/* Styles spécifiques au composant si nécessaire */
</style>