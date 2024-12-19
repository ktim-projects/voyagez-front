<template>
  <div class="min-h-[calc(100vh-4rem)] relative">
    <div class="grid grid-cols-1 md:grid-cols-12 h-full">
      <!-- Left Panel -->
      <div class="md:col-span-5 lg:col-span-4 bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-4rem)]">
        <!-- Search Form -->
        <div class="p-6 border-b border-gray-200">
          <form @submit.prevent="searchRoute" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Type de recherche</label>
              <div class="flex space-x-6">
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="searchType" 
                    value="number" 
                    class="form-radio text-blue-600"
                  >
                  <span class="ml-2 text-sm text-gray-600">Par numéro de bus</span>
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="searchType" 
                    value="route" 
                    class="form-radio text-blue-600"
                  >
                  <span class="ml-2 text-sm text-gray-600">Par trajet</span>
                </label>
              </div>
            </div>

            <template v-if="searchType === 'number'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Numéro de bus</label>
                <input
                  v-model="search.busNumber"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 81"
                />
              </div>
            </template>

            <template v-else>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Point de départ</label>
                  <BusStopSelect
                    v-model="search.from"
                    placeholder="Sélectionnez un arrêt de départ"
                    @select="onFromStopSelect"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Point d'arrivée</label>
                  <BusStopSelect
                    v-model="search.to"
                    placeholder="Sélectionnez un arrêt d'arrivée"
                    @select="onToStopSelect"
                  />
                </div>
              </div>
            </template>

            <button 
              type="submit" 
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="!isFormValid"
            >
              Rechercher
            </button>
          </form>
        </div>

        <!-- Results -->
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <BusLoader />
            <p class="text-gray-500 mt-2">Recherche en cours...</p>
          </div>

          <template v-else>
            <!-- Bus Line or Route Results -->
            <div v-if="searchType === 'number' && busLine || (searchType === 'route' && busLine)" 
                 class="bg-white rounded-lg">
              <!-- Header -->
              <div class="mb-6">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center" 
                       :style="{ backgroundColor: `${busLine.color}20` }">
                    <span class="text-lg font-bold" :style="{ color: busLine.color }">
                      {{ busLine.number }}
                    </span>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-medium">{{ busLine.name }}</h3>
                    <p class="text-sm text-gray-500">{{ busLine.description }}</p>
                    <p v-if="searchType === 'route'" class="text-sm font-medium mt-1">
                      Direction : <span class="text-blue-600">{{ busLine.directionTerminus }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Itinerary Steps -->
              <div class="relative space-y-4">
                <!-- Timeline vertical line -->
                <div class="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200"></div>
                
                <template v-if="searchType === 'number'">
                  <div 
                    v-for="(stop, index) in busLine.stops" 
                    :key="stop.id" 
                    class="relative pl-8"
                    @mouseenter="highlightedStop = index"
                    @mouseleave="highlightedStop = null"
                  >
                    <div 
                      class="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center transition-colors" 
                      :class="{ 'border-blue-600': highlightedStop === index }"
                      :style="{ borderColor: highlightedStop === index ? busLine.color : busLine.color + '40' }"
                    >
                      <div class="w-2 h-2 rounded-full" 
                           :style="{ backgroundColor: highlightedStop === index ? busLine.color : busLine.color + '40' }">
                      </div>
                    </div>
                    <div class="py-1">
                      <p class="font-medium text-gray-900 text-sm">{{ stop.name }}</p>
                      <p class="text-xs text-gray-500">{{ stop.description }}</p>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div 
                    v-for="(stop, index) in busLine.stops" 
                    :key="stop.id" 
                    class="relative pl-8"
                    @mouseenter="highlightedStop = index"
                    @mouseleave="highlightedStop = null"
                  >
                    <div 
                      class="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center transition-colors" 
                      :class="{ 
                        'border-blue-600': highlightedStop === index,
                        'opacity-40': !isStopInRoute(stop, index)
                      }"
                      :style="{ 
                        borderColor: highlightedStop === index ? busLine.color : busLine.color + '40',
                        borderWidth: stop.name === selectedFromStop?.name || stop.name === selectedToStop?.name ? '3px' : '2px'
                      }"
                    >
                      <div class="w-2 h-2 rounded-full" 
                           :style="{ 
                             backgroundColor: highlightedStop === index ? busLine.color : busLine.color + '40',
                             opacity: isStopInRoute(stop, index) ? '1' : '0.4'
                           }">
                      </div>
                    </div>
                    <div class="py-1" :class="{ 'opacity-40': !isStopInRoute(stop, index) }">
                      <p class="font-medium text-gray-900 text-sm" 
                         :class="{ 
                           'text-blue-600': stop.name === selectedFromStop?.name || stop.name === selectedToStop?.name,
                         }">
                        {{ stop.name }}
                      </p>
                      <p class="text-xs text-gray-500">{{ stop.description }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <EmptyState
              v-else
              title="Aucun résultat trouvé"
              description="Essayez de modifier vos critères de recherche"
              image="/images/empty-search.svg"
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
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { BusLine, BusRoute } from '~/server/data/mockData';
import BusStopSelect from './BusStopSelect.vue';
import { busLines } from '~/server/data';

interface BusStop {
  id: string
  name: string
  latitude: number
  longitude: number
  description: string
}

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let polyline: L.Polyline | null = null;
let markers: L.Marker[] = [];

const searchType = ref<'number' | 'route'>('number');
const search = ref({
  from: '',
  to: '',
  busNumber: ''
});

const busLine = ref<BusLine | null>(null);
const selectedFromStop = ref<BusStop | null>(null);
const selectedToStop = ref<BusStop | null>(null);
const highlightedStop = ref<number | null>(null);

// Centre d'Abidjan
const ABIDJAN_CENTER: [number, number] = [5.3599, -4.0083];

const isFormValid = computed(() => {
  if (searchType.value === 'number') {
    return search.value.busNumber.trim() !== ''
  } else {
    return search.value.from.trim() !== '' && search.value.to.trim() !== ''
  }
});

const findBusLineByStops = (fromStop: BusStop, toStop: BusStop) => {
  for (const line of busLines) {
    const fromIndex = line.stops.findIndex(stop => stop.name === fromStop.name);
    const toIndex = line.stops.findIndex(stop => stop.name === toStop.name);
    
    if (fromIndex !== -1 && toIndex !== -1) {
      // Déterminer l'ordre des arrêts
      const isReverse = fromIndex > toIndex;
      const orderedStops = [...line.stops];
      
      if (isReverse) {
        orderedStops.reverse();
      }
      
      // Déterminer le terminus de direction
      const directionTerminus = isReverse ? line.stops[0].name : line.stops[line.stops.length - 1].name;
      
      return {
        line: {
          ...line,
          stops: orderedStops,
          directionTerminus
        },
        fromIndex: isReverse ? line.stops.length - 1 - fromIndex : fromIndex,
        toIndex: isReverse ? line.stops.length - 1 - toIndex : toIndex,
        isReverse
      };
    }
  }
  return null;
};

// Fonction pour vérifier si un arrêt fait partie du trajet sélectionné
const isStopInRoute = (stop: BusStop, index: number) => {
  if (!selectedFromStop.value || !selectedToStop.value || !busLine.value) return false;
  const fromIndex = busLine.value.stops.findIndex(s => s.name === selectedFromStop.value?.name);
  const toIndex = busLine.value.stops.findIndex(s => s.name === selectedToStop.value?.name);
  return index >= Math.min(fromIndex, toIndex) && index <= Math.max(fromIndex, toIndex);
};

const getDirectionIcon = (isReverse: boolean) => {
  return isReverse ? '🔄' : '➡️';
};

const searchRoute = async () => {
  loading.value = true;
  busLine.value = null;
  clearMap();
  
  try {
    if (searchType.value === 'number') {
      const foundLine = await $fetch(`/api/bus/line/${search.value.busNumber}`);
      if (foundLine) {
        busLine.value = foundLine;
        drawBusLine(foundLine);
      }
    } else if (selectedFromStop.value && selectedToStop.value) {
      const resultData = findBusLineByStops(selectedFromStop.value, selectedToStop.value);
      if (resultData) {
        busLine.value = resultData.line;
        const highlightedStops = {
          fromIndex: resultData.fromIndex,
          toIndex: resultData.toIndex,
          isReverse: resultData.isReverse
        };
        drawBusLine(resultData.line, highlightedStops);
      }
    }
    
    // Mettre à jour les query params après la recherche
    updateQueryParams();
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
  } finally {
    loading.value = false;
  }
};

const initFromQueryParams = async () => {
  const { number, from, to } = route.query

  if (number) {
    searchType.value = 'number'
    search.value.busNumber = number as string
    await searchRoute()
  } else if (from && to) {
    searchType.value = 'route'
    // Trouver les arrêts correspondants
    const fromStop = busLines.flatMap(line => line.stops).find(stop => stop.name === from)
    const toStop = busLines.flatMap(line => line.stops).find(stop => stop.name === to)
    
    if (fromStop && toStop) {
      selectedFromStop.value = fromStop
      selectedToStop.value = toStop
      search.value.from = fromStop.name
      search.value.to = toStop.name
      await searchRoute()
    }
  }
}

const updateQueryParams = () => {
  const query: Record<string, string> = {}
  
  if (searchType.value === 'number' && search.value.busNumber) {
    query.number = search.value.busNumber
  } else if (searchType.value === 'route' && selectedFromStop.value && selectedToStop.value) {
    query.from = selectedFromStop.value.name
    query.to = selectedToStop.value.name
  }
  
  router.replace({ query })
}

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView(ABIDJAN_CENTER, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Initialiser la recherche avec les query params
    initFromQueryParams();
  }
});

const onFromStopSelect = (stop: BusStop) => {
  selectedFromStop.value = stop;
};

const onToStopSelect = (stop: BusStop) => {
  selectedToStop.value = stop;
};

const clearMap = () => {
  if (!map) return;
  
  markers.forEach(marker => map?.removeLayer(marker));
  markers = [];
  
  if (polyline) {
    map.removeLayer(polyline);
    polyline = null;
  }
};

const drawBusLine = (line: BusLine, highlightedStops?: { fromIndex: number; toIndex: number; isReverse: boolean }) => {
  if (!map) return;
  clearMap();

  const coordinates = line.stops.map(stop => [stop.latitude, stop.longitude]);

  // Dessiner la ligne complète avec une opacité réduite
  polyline = L.polyline(coordinates as L.LatLngExpression[], {
    color: line.color,
    weight: 4,
    opacity: 0.3
  }).addTo(map);

  // Si on a un trajet sélectionné, dessiner une ligne plus visible pour ce segment
  if (highlightedStops) {
    const minIndex = Math.min(highlightedStops.fromIndex, highlightedStops.toIndex);
    const maxIndex = Math.max(highlightedStops.fromIndex, highlightedStops.toIndex);
    const highlightedCoordinates = coordinates.slice(minIndex, maxIndex + 1);
    
    L.polyline(highlightedCoordinates as L.LatLngExpression[], {
      color: line.color,
      weight: 4,
      opacity: 1
    }).addTo(map);
  }

  // Ajouter les marqueurs pour tous les arrêts
  line.stops.forEach((stop, index) => {
    const isHighlighted = highlightedStops && 
                         index >= Math.min(highlightedStops.fromIndex, highlightedStops.toIndex) && 
                         index <= Math.max(highlightedStops.fromIndex, highlightedStops.toIndex);

    const isEndpoint = highlightedStops && 
                      (index === highlightedStops.fromIndex || 
                       index === highlightedStops.toIndex);

    let icon;
    if (isEndpoint) {
      icon = L.divIcon({
        html: index === highlightedStops?.fromIndex ? '🚏' : '🏁',
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });
    } else {
      icon = L.divIcon({
        html: '•',
        className: `custom-marker ${isHighlighted ? 'highlighted' : 'faded'}`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
    }

    const marker = L.marker([stop.latitude, stop.longitude], { icon });
    marker.addTo(map!);
    markers.push(marker);
  });

  const bounds = L.latLngBounds(coordinates as L.LatLngExpression[]);
  map.fitBounds(bounds, { padding: [50, 50] });
};

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
.custom-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.custom-marker.highlighted {
  color: #2563eb;
  font-size: 1.4rem;
}

.custom-marker.faded {
  opacity: 0.4;
}
</style>