<template>
  <div class="h-[calc(100vh-4rem)]">
    <div class="grid grid-cols-1 md:grid-cols-3 h-full">
      <!-- Left Panel -->
      <div class="md:col-span-1 bg-white border-r border-gray-200 overflow-y-auto">
        <!-- Search Form -->
        <div class="p-4 border-b border-gray-200">
          <form @submit.prevent="searchRoute" class="space-y-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Type de recherche</label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="searchType" 
                    value="number" 
                    class="form-radio bg-primary"
                  >
                  <span class="ml-2 text-sm">Par numéro de bus</span>
                </label>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="searchType" 
                    value="route" 
                    class="form-radio"
                  >
                  <span class="ml-2 text-sm">Par trajet</span>
                </label>
              </div>
            </div>

            <template v-if="searchType === 'number'">
              <div>
                <label class="block text-sm font-medium text-gray-700">Numéro de bus</label>
                <input
                  v-model="search.busNumber"
                  type="text"
                  class="input-field"
                  placeholder="Ex: 81"
                />
              </div>
            </template>

            <template v-else>
              <div>
                <label class="block text-sm font-medium text-gray-700">Point de départ</label>
                <AddressAutocomplete
                  v-model="search.from"
                  placeholder="Arrêt de départ"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Point d'arrivée</label>
                <AddressAutocomplete
                  v-model="search.to"
                  placeholder="Arrêt d'arrivée"
                />
              </div>
            </template>

            <button 
              type="submit" 
              class="w-full btn-primary"
              :disabled="!isFormValid"
            >
              Rechercher
            </button>
          </form>
        </div>

        <!-- Results -->
        <div class="p-4">
          <div v-if="loading" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600">Recherche en cours...</p>
          </div>

          <template v-else>
            <!-- Bus Line Stops -->
            <template v-if="searchType === 'number' && busLine">
              <div class="mb-4">
                <h3 class="text-lg font-medium mb-2">Ligne {{ busLine.number }}</h3>
                <p class="text-sm text-gray-600">{{ busLine.name }}</p>
              </div>
              
              <div class="relative pl-8 space-y-6">
                <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div 
                  v-for="(stop, index) in busLine.stops" 
                  :key="stop.id" 
                  class="relative"
                  @mouseenter="highlightedStop = index"
                  @mouseleave="highlightedStop = null"
                >
                  <div 
                    class="absolute left-[-1.875rem] w-4 h-4 rounded-full bg-white border-2 transition-colors" 
                    :class="{ 'border-primary-600': highlightedStop === index }"
                    :style="{ borderColor: highlightedStop === index ? busLine.color : busLine.color + '80' }"
                  ></div>
                  <div>
                    <p class="font-medium">{{ stop.name }}</p>
                    <p class="text-sm text-gray-500">{{ stop.description }}</p>
                  </div>
                </div>
              </div>
            </template>

            <!-- Route Results -->
            <template v-else-if="searchType === 'route' && selectedRoute">
              <div class="mb-6">
                <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Meilleur itinéraire</span>
                  <span>{{ selectedRoute.duration }}</span>
                </div>
                <div class="bg-primary-50 rounded-lg p-4">
                  <div class="space-y-4">
                    <div v-for="(step, index) in selectedRoute.steps" :key="index" 
                         class="flex items-start space-x-3">
                      <div class="flex-shrink-0 mt-1">
                        <div v-if="step.type === 'walk'" 
                             class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                          </svg>
                        </div>
                        <div v-else 
                             class="w-6 h-6 rounded-full flex items-center justify-center"
                             :style="{ backgroundColor: `${step.color}20`, color: step.color }">
                          <span class="text-xs font-medium">{{ step.line }}</span>
                        </div>
                      </div>
                      <div class="flex-1">
                        <div class="text-sm font-medium">{{ step.description }}</div>
                        <div class="text-xs text-gray-500">{{ step.duration }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <EmptyState
              v-else
              title="Aucun résultat trouvé"
              description="Essayez de modifier vos critères de recherche"
              image="/images/empty-search.svg"
            />
          </template>
        </div>
      </div>

      <!-- Map -->
      <div class="md:col-span-2 relative">
        <div ref="mapContainer" class="absolute inset-0"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { BusLine, BusRoute } from '~/server/data/mockData';

const route = useRoute();
const loading = ref(false);
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markers: L.Marker[] = [];
let polyline: L.Polyline | null = null;

const searchType = ref(route.query.number ? 'number' : 'route');
const search = ref({
  from: route.query.from as string || '',
  to: route.query.to as string || '',
  busNumber: route.query.number as string || ''
});

const busLine = ref<BusLine | null>(null);
const selectedRoute = ref<BusRoute | null>(null);
const highlightedStop = ref<number | null>(null);

// Centre d'Abidjan
const ABIDJAN_CENTER = [5.3599517, -4.0082563];

const isFormValid = computed(() => {
  if (searchType.value === 'number') {
    return !!search.value.busNumber;
  }
  return !!search.value.from && !!search.value.to;
});

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView(ABIDJAN_CENTER, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Initial search if parameters are present
    if (route.query.number || (route.query.from && route.query.to)) {
      searchRoute();
    }
  }
});

const clearMap = () => {
  if (!map) return;
  
  markers.forEach(marker => map?.removeLayer(marker));
  markers = [];
  
  if (polyline) {
    map.removeLayer(polyline);
    polyline = null;
  }
};

const searchRoute = async () => {
  loading.value = true;
  clearMap();

  try {
    if (searchType.value === 'number') {
      const response = await $fetch(`/api/bus/line/${search.value.busNumber}`);
      busLine.value = response as BusLine;
      selectedRoute.value = null;
      
      if (busLine.value) {
        drawBusLine(busLine.value);
      }
    } else {
      const response = await $fetch('/api/bus/route', {
        params: {
          from: search.value.from,
          to: search.value.to
        }
      });
      selectedRoute.value = response as BusRoute;
      busLine.value = null;
      
      if (selectedRoute.value) {
        drawRoute(selectedRoute.value);
      }
    }
  } catch (error: any) {
    console.error('Error searching route:', error);
    selectedRoute.value = null;
    busLine.value = null;
  } finally {
    loading.value = false;
  }
};

const drawBusLine = (line: BusLine) => {
  if (!map) return;

  // Add start and end markers
  const startStop = line.stops[0];
  const endStop = line.stops[line.stops.length - 1];

  // Start marker
  const startIcon = L.divIcon({
    html: '🚌',
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 20]
  });
  const startMarker = L.marker([startStop.latitude, startStop.longitude], { icon: startIcon });
  startMarker.addTo(map);
  markers.push(startMarker);

  // End marker
  const endIcon = L.divIcon({
    html: '🚩',
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 20]
  });
  const endMarker = L.marker([endStop.latitude, endStop.longitude], { icon: endIcon });
  endMarker.addTo(map);
  markers.push(endMarker);

  // Draw line between stops
  const coordinates = line.stops.map(stop => [stop.latitude, stop.longitude]);
  polyline = L.polyline(coordinates as L.LatLngExpression[], {
    color: line.color,
    weight: 4
  }).addTo(map);

  // Fit bounds
  const bounds = L.latLngBounds(coordinates as L.LatLngExpression[]);
  map.fitBounds(bounds, { padding: [50, 50] });
};

const drawRoute = (route: BusRoute) => {
  if (!map) return;

  // Add start marker
  const startPoint = route.steps[0].path[0];
  const startIcon = L.divIcon({
    html: '🚶',
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 20]
  });
  const startMarker = L.marker(startPoint, { icon: startIcon });
  startMarker.addTo(map);
  markers.push(startMarker);

  // Add end marker
  const lastStep = route.steps[route.steps.length - 1];
  const endPoint = lastStep.path[lastStep.path.length - 1];
  const endIcon = L.divIcon({
    html: '🚩',
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 20]
  });
  const endMarker = L.marker(endPoint, { icon: endIcon });
  endMarker.addTo(map);
  markers.push(endMarker);

  // Draw each segment
  route.steps.forEach((step) => {
    const options: L.PolylineOptions = {
      color: step.color,
      weight: 4,
      opacity: 0.8
    };

    if (step.type === 'walk') {
      options.dashArray = '5, 10';
      options.weight = 3;
    }

    L.polyline(step.path, options).addTo(map!);
  });

  // Fit bounds
  const bounds = L.latLngBounds(route.steps.flatMap(step => step.path));
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

<style>
.leaflet-container {
  font: inherit;
}
.custom-marker {
  font-size: 20px;
  text-align: center;
}
</style>