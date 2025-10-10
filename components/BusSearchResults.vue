<template>
  <div class="md:min-h-[calc(100vh-4rem)] relative">
    <div class="grid grid-cols-1 md:grid-cols-12 md:h-full">
      <div class="bg-primary-600 md:hidden fixed top-0 left-0 right-0 z-50 shadow-md">
        <div class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <NuxtLink to="/" class="text-white">
                <ChevronLeft class="w-5 h-5" />
              </NuxtLink>
              <div v-if="selectedRoute" class="text-white font-medium">
                {{ $t('busSearch.line') }} {{ displayedBusNumber }}
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
      
      <div v-if="routes.length > 0" class="md:hidden fixed top-16 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center justify-center">
          <div class="flex items-center border border-primary-300 dark:border-primary-600 rounded-full p-1 bg-gray-50 dark:bg-gray-800">
            <button
              @click="showMapOnMobile = false"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                !showMapOnMobile 
                  ? 'bg-primary-600 text-white shadow-sm' 
                  : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              ]"
            >
              <ListIcon class="w-4 h-4" />
              <span>{{ $t('label.list') }}</span>
            </button>
            
            <button
              @click="showMapOnMobile = true"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                showMapOnMobile 
                  ? 'bg-primary-600 text-white shadow-sm' 
                  : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              ]"
            >
              <MapIcon class="w-4 h-4" />
              <span>{{ $t('label.map') }}</span>
            </button>
          </div>
        </div>
      </div>
 
      <div class="md:col-span-5 lg:col-span-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto md:h-[calc(100vh-4rem)] md:pt-0" :class="[{'hidden md:block': showMapOnMobile}, routes.length > 0 ? 'pt-28' : 'pt-14']">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700" :class="{'hidden md:block': routes.length > 0}" v-if="!loading">
          <form @submit.prevent="searchRoute" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('busSearch.busNumber') }}</label>
                <input
                  v-model="busNumber"
                  type="text"
                  class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-corail-500 focus:border-transparent"
                  :placeholder="$t('busSearch.busNumberPlaceholder')"
                />
              </div>
            <AppButton type="submit" variant="corail" :label="$t('busSearch.searchButton')" :disabled="!isFormValid" />
          </form>
        </div>

        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <BusLoader />
            <p class="text-gray-500 dark:text-gray-400 mt-2">{{ $t('busSearch.searchingMessage') }}</p>
          </div>

          <EmptyState
              v-else-if="routes.length === 0"
              :title="$t('busSearch.noResults')"
              :description="$t('busSearch.noResultsDescription')"
              image="/images/empty-search.svg"
              class="dark:text-white"
            />

          <template v-else>
            <div v-if="routes.length > 0" class="bg-white dark:bg-gray-800 rounded-lg pt-4">
              <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                {{ $t('busSearch.line') }} {{ displayedBusNumber }}
                <span v-if="selectedRoute && selectedRoute.isExpress" class="ml-2 text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full hidden md:inline-block">
                  {{ $t('busSearch.express') }}
                </span>
                <span v-if="lineTags.charge" class="ml-2 text-sm bg-corail-100 dark:bg-corail-900 text-corail-700 dark:text-corail-300 px-2 py-0.5 rounded-full">
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
              <div v-if="routes.length > 1" class="mb-6">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ $t('busSearch.selectRoute') }}</p>
                <div class="relative">
                  <select 
                    v-model="selectedRouteId" 
                    @change="handleRouteChange"
                    class="w-full px-4 py-2 pr-10 rounded-md text-sm font-normal bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-corail-500 focus:border-transparent appearance-none truncate"
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
          </template>
        </div>
      </div>
      <!-- Map (Desktop always, Mobile conditionally) -->
      <div class="md:col-span-7 lg:col-span-8 relative bg-gray-100 dark:bg-gray-900" :class="[
        showMapOnMobile ? 'block' : 'hidden md:block',
        showMapOnMobile && routes.length > 0 ? 'h-[calc(100vh-9rem)] mt-20' : 'h-screen md:h-[calc(100vh-4rem)]'
      ]">
        <div ref="mapContainer" class="absolute inset-0 z-0"></div>
      </div>
    </div>
  </div>
  <!-- Search Form Modal -->
  <BusSearchModal
    v-model:show="showSearchModal"
    v-model:ref="modalBusNumber"
    @search="handleModalSearch"
  />
</template>

<script setup lang="ts">
import { LineData } from '~/modules/bus/models/line_data';
import { getAllRoutesInfo } from '~/modules/bus/utils/route-utils';
import { ChevronLeft, X as XIcon, Map as MapIcon, List as ListIcon } from 'lucide-vue-next';
import { useSearchStore } from '~/stores/search';

let L: any = null;
let displayRouteMap: any = null;

export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}

 interface BusLine {
  id: string;
  number: string;
  name: string;
  color: string;
  stops: BusStop[];
}

// Types pour les données
interface Stop {
  id: string | number | undefined;
  name: string;
  coordinates: [number, number] | null;
}

interface Route {
  id: number;
  name: string;
  color: string;
  stops: Stop[];
  shape: any;
  isExpress?: boolean;
  duration?: number;
}

interface LineDetails {
  lineId: string;
  lineTags: Record<string, string>;
  details: any;
}

const searchStore = useSearchStore();
const route = useRoute();
const router = useRouter();

const lines = ref<BusLine[]>([]);
const busNumber = ref(searchStore.ref || '');
const modalBusNumber = ref('');
const loading = ref(true);
const lastSearchedBusNumber = ref('');
const displayedBusNumber = ref('');
const isFormValid = computed(() => busNumber.value.trim() !== '' && busNumber.value !== lastSearchedBusNumber.value);
const routes = ref<Route[]>([]);
const selectedRouteId = ref<number | null>(null);
const mapContainer = ref<HTMLDivElement | null>(null);
const map = ref<L.Map | null>(null);
const lineTags = ref<Record<string, string>>({});
const showSearchModal = ref(false);
const showMapOnMobile = ref(false);

const ABIDJAN_CENTER: [number, number] = [5.3599, -4.0083];
const IVORY_COAST_CENTER: [number, number] = [7.539989, -5.54708];

const { searchBus } = useSecureApi()

// Fonction pour rechercher une ligne de bus
const searchRoute = async () => {
  if (!isFormValid.value) return;
  
  try {
    loading.value = true;
    routes.value = [];
    selectedRouteId.value = null;
    
    // Réinitialiser la vue mobile sur les résultats lors d'une nouvelle recherche
    showMapOnMobile.value = false;
    
    // Mettre à jour l'URL avec le paramètre ref
    await router.push(`/results/bus/${encodeURIComponent(busNumber.value.trim())}`);
    
    // Réinitialiser la carte si elle existe
    if (map.value) {
      try {
        map.value.remove();
      } catch (error) {
        console.warn('Erreur lors de la suppression de la carte:', error);
      }
      map.value = null;
    }
    
    // S'assurer que le conteneur est vide
    if (mapContainer.value) {
      mapContainer.value.innerHTML = '';
    }

    const data = await searchBus(busNumber.value)

    if (data && data.lineId && data.details) {
      lineTags.value = data.lineTags || {};
      
      const lineData = new LineData();
      const result = lineData.initFromData(data.details, parseInt(data.lineId));
      
      const trips = lineData.getTrips();
      routes.value = getAllRoutesInfo(trips);
      
      if (routes.value.length > 0) {
        selectedRouteId.value = routes.value[0].id;
        nextTick(() => {
          updateMap();
        });
      }
      
      displayedBusNumber.value = busNumber.value;
      
    } else {
      console.error('Incomplete data in the response');
    }
    
    lastSearchedBusNumber.value = busNumber.value;
    
  } catch (error: any) {
    console.error('Error during search:', error);
    
    let errorMessage = 'An error occurred during the search.';
    
    if (error.statusCode === 504) {
      errorMessage = 'The search takes longer than expected. Please try again in a few minutes.';
    } else if (error.statusCode === 503) {
      errorMessage = 'The service is temporarily unavailable. Please try again later.';
    } else if (error.statusCode === 404) {
      errorMessage = `No bus line found with the number "${busNumber.value}".`;
    }
    
    console.warn('User-friendly error:', errorMessage);
    
  } finally {
    loading.value = false;
  }
}

const handleRouteChange = () => {
  if (selectedRouteId.value !== null) {
    selectRoute(selectedRouteId.value);
  }
};

const selectRoute = (routeId: number) => {
  selectedRouteId.value = routeId;
  nextTick(() => {
    updateMap();
  });
}

const selectedRoute = computed((): Route | null => {
  if (!selectedRouteId.value) return null;
  return routes.value.find(route => route.id === selectedRouteId.value) || null;
});

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  
  return `${mins} min`;
};

const calculateBounds = (stops: Stop[]): [[number, number], [number, number]] | null => {
  const validCoordinates = stops
    .map(stop => stop.coordinates)
    .filter((coord): coord is [number, number] => coord !== null);
  
  if (validCoordinates.length === 0) return null;
  
  // Les coordonnées sont en format [lng, lat], mais Leaflet attend [lat, lng]
  const lats = validCoordinates.map(coord => coord[1]); // latitude = index 1
  const lngs = validCoordinates.map(coord => coord[0]); // longitude = index 0
  
  return [
    [Math.min(...lats), Math.min(...lngs)], // Sud-Ouest [lat, lng]
    [Math.max(...lats), Math.max(...lngs)]  // Nord-Est [lat, lng]
  ];
};

// Mettre à jour la carte avec l'itinéraire sélectionné
const updateMap = () => {
  if (!mapContainer.value || !displayRouteMap) return;
  
  // Supprimer la carte existante si elle existe
  if (map.value) {
    try {
      map.value.remove();
    } catch (error) {
      console.warn('Error while deleting the map in updateMap:', error);
    }
    map.value = null;
  }
  
  // S'assurer que le conteneur est propre
  if (mapContainer.value) {
    mapContainer.value.innerHTML = '';
  }
  
  if (selectedRoute.value) {
    // Afficher la nouvelle carte avec l'itinéraire sélectionné
    const route = selectedRoute.value;
    if (mapContainer.value) {
      map.value = displayRouteMap(
        mapContainer.value as any,
        route.shape,
        route.stops.map((stop: Stop) => {
          // Convertir les arrêts en format GeoJSON pour la carte
          if (stop.coordinates) {
            return {
              id: stop.id,
              type: 'Feature' as const,
              geometry: {
                type: 'Point' as const,
                coordinates: stop.coordinates
              },
              properties: {
                name: stop.name
              }
            };
          }
          return null;
        }).filter((item): item is NonNullable<typeof item> => item !== null),
        route.color
      );
      
      // Centrer la carte sur les résultats
      const bounds = calculateBounds(route.stops);
      if (bounds && map.value) {
        try {
          map.value.fitBounds(bounds, {
            padding: [20, 20], // Padding en pixels
            maxZoom: 15 // Zoom maximum pour éviter d'être trop proche
          });
        } catch (error) {
          console.warn('Error while centering the map, use default center:');
          map.value.setView(ABIDJAN_CENTER, 12);
        }
      }
    }
  }
}

// Initialiser la carte par défaut
const initDefaultMap = () => {
  if (!mapContainer.value || !L) return;
  
  // Nettoyer le conteneur au cas où
  if (map.value) {
    try {
      map.value.remove();
    } catch (error) {
      console.warn('Error while deleting the map:', error);
    }
    map.value = null;
  }
  
  // S'assurer que le conteneur est vide
  mapContainer.value.innerHTML = '';
  
  // Initialiser la carte centrée sur la Côte d'Ivoire (vue d'ensemble)
  // Centre approximatif de la Côte d'Ivoire pour couvrir plus de villes
  try {
    map.value = L.map(mapContainer.value as any).setView(IVORY_COAST_CENTER, 8);
  } catch (error) {
    console.error('Error while initializing the map:', error);
    return;
  }
  
  // Ajouter la couche de tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.7
  }).addTo(map.value as any);
  
  // Ajouter l'échelle
  L.control.scale().addTo(map.value as any);
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
onMounted(async () => {
  if (process.client) {
    await import('leaflet/dist/leaflet.css');
    L = (await import('leaflet')).default;
    const mapUtils = await import('~/modules/bus/utils/map-utils');
    displayRouteMap = mapUtils.displayRouteMap;
  }
  
  initDefaultMap();
  
  // Les valeurs sont déjà synchronisées depuis le store
  // (mis à jour par la page dynamique bus/[ref].vue)
  
  // Déclencher automatiquement la recherche si un numéro de bus est fourni dans le store
  if (searchStore.ref) {
    busNumber.value = searchStore.ref;
    searchRoute();
  }
});

// Nettoyer la carte lors du démontage du composant
onUnmounted(() => {
  if (map.value) {
    try {
      map.value.remove();
    } catch (error) {
      console.warn('Error while deleting the map:', error);
    }
    map.value = null;
  }
});

// Observer les changements de l'itinéraire sélectionné pour mettre à jour la carte
watch(selectedRoute, () => {
  updateMap();
});

// Lorsque la modal s'ouvre, initialiser le numéro de bus
watch(showSearchModal, (newValue: boolean) => {
  if (newValue) {
    modalBusNumber.value = busNumber.value;
  }
});

// Watcher pour synchroniser avec les changements de paramètres de route
watch(() => route.params.ref, (newRef) => {
  if (newRef && typeof newRef === 'string' && newRef !== busNumber.value) {
    busNumber.value = newRef;
    // Ne pas déclencher automatiquement la recherche pour éviter les boucles
  }
});

// Watcher pour redimensionner la carte quand on bascule en mobile
watch(showMapOnMobile, () => {
  if (map.value) {
    // Attendre que le DOM soit mis à jour
    nextTick(() => {
      try {
        // Petit délai pour s'assurer que les transitions CSS sont terminées
        setTimeout(() => {
          map.value?.invalidateSize();
          
          // Si on bascule vers la carte et qu'il y a des résultats, recentrer sur les arrêts
          if (showMapOnMobile.value && routes.value.length > 0) {
            // Utiliser la route sélectionnée ou la première route disponible
            const routeToShow = selectedRouteId.value !== null 
              ? routes.value.find(r => r.id === selectedRouteId.value)
              : routes.value[0];
              
            if (routeToShow) {
              const bounds = calculateBounds(routeToShow.stops);
              if (bounds && map.value) {
                map.value.fitBounds(bounds, {
                  padding: [20, 20],
                  maxZoom: 15
                });
              }
            }
          }
        }, 150); // Délai légèrement augmenté pour les transitions
      } catch (error) {
        console.warn('Erreur lors du redimensionnement de la carte:', error);
      }
    });
  }
});

// SEO
useHead({
  title: 'Recherche de Bus - Geyavo',
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