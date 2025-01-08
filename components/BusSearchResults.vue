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
              <div class="space-y-1 max-w-md mx-auto relative">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Point de départ</label>
                  <BusStopSelect
                    v-model="search.from"
                    :stops="allStops"
                    placeholder="Sélectionnez un arrêt de départ"
                    @select="onFromStopSelect"
                    class="w-full"
                  />
                </div>

                <div class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style="top: 50%;">
                  <button
                    @click="invertRoute"
                    class="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 z-10"
                    title="Inverser le trajet"
                  >
                    <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Point d'arrivée</label>
                  <BusStopSelect
                    v-model="search.to"
                    :stops="allStops"
                    placeholder="Sélectionnez un arrêt d'arrivée"
                    @select="onToStopSelect"
                    class="w-full"
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
            <!-- Affichage pour la recherche par numéro -->
            <div v-if="searchType === 'number' && busLine" class="bg-white rounded-lg p-6">
              <!-- Garder l'affichage existant pour la recherche par numéro -->
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
                  </div>
                </div>
              </div>

              <!-- Liste des arrêts -->
              <div class="relative space-y-4">
                <div class="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200"></div>
                
                <div v-for="(stop, index) in busLine.stops" 
                     :key="stop.id" 
                     class="relative pl-8"
                     @mouseenter="highlightedStop = index"
                     @mouseleave="highlightedStop = null">
                  <div class="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center transition-colors"
                       :class="{ 'border-blue-600': highlightedStop === index }"
                       :style="{ borderColor: highlightedStop === index ? busLine.color : busLine.color + '40' }">
                    <div class="w-2 h-2 rounded-full" 
                         :style="{ backgroundColor: highlightedStop === index ? busLine.color : busLine.color + '40' }">
                    </div>
                  </div>
                  <div class="py-1">
                    <p class="font-medium text-gray-900 text-sm">{{ stop.name }}</p>
                    <p class="text-xs text-gray-500">{{ stop.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Affichage pour la recherche par trajet -->
            <div v-else-if="searchType === 'route' && routes.length > 0" class="space-y-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Itinéraires proposés :</h3>
              
              <div v-for="(route, index) in routes" :key="index" 
                   class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-2">
                    <span class="text-lg font-medium">{{ getRouteTitle(route, index) }}</span>
                    <span class="text-sm text-gray-500">
                      ({{ Math.round(route.totalDistance * 10) / 10 }} km)
                    </span>
                  </div>
                </div>

                <!-- Instructions détaillées -->
                <div class="space-y-6">
                  <template v-for="(step, stepIndex) in route.steps" :key="stepIndex">
                    <!-- Étape de marche initiale si nécessaire -->
                    <div v-if="step.type === 'walk'" class="pl-4 border-l-2 border-gray-200">
                      <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span class="text-gray-600">🚶</span>
                        </div>
                        <div>
                          <p class="font-medium">Marchez jusqu'à l'arrêt {{ step.toStop.name }}</p>
                          <p class="text-sm text-gray-500">{{ Math.round(step.distance * 1000) }}m de marche</p>
                        </div>
                      </div>
                    </div>

                    <!-- Étape de bus -->
                    <div v-else-if="step.type === 'bus' && step.busLine" class="pl-4 border-l-2 border-gray-200">
                      <div class="flex items-center space-x-2 mb-4">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center"
                             :style="{ backgroundColor: step.busLine.color + '20' }">
                          <span class="text-sm font-bold" :style="{ color: step.busLine.color }">
                            {{ step.busLine.number }}
                          </span>
                        </div>
                        <div>
                          <p class="font-medium">
                            Prenez le bus {{ step.busLine.number }}
                            <span class="text-gray-600" v-if="getDirectionInfo(step.busLine, step.fromStop, step.toStop)">
                              direction {{ getDirectionInfo(step.busLine, step.fromStop, step.toStop)?.direction }}
                            </span>
                          </p>
                          <p class="text-sm text-gray-500" v-if="getDirectionInfo(step.busLine, step.fromStop, step.toStop)">
                            {{ getDirectionInfo(step.busLine, step.fromStop, step.toStop)?.numberOfStops }} 
                            arrêt{{ getDirectionInfo(step.busLine, step.fromStop, step.toStop)?.numberOfStops !== 1 ? 's' : '' }}
                            ({{ Math.round(step.distance * 10) / 10 }} km)
                          </p>
                        </div>
                      </div>

                      <!-- Liste des arrêts pour cette ligne -->
                      <div class="ml-10 space-y-2" v-if="getDirectionInfo(step.busLine, step.fromStop, step.toStop)">
                        <div v-for="(stop, stopIndex) in getDirectionInfo(step.busLine, step.fromStop, step.toStop)?.stops"
                             :key="stop.id"
                             class="flex items-center space-x-2">
                          <div class="w-2 h-2 rounded-full"
                               :class="{ 
                                 'bg-blue-500': stopIndex === 0,
                                 'bg-green-500': stopIndex === getDirectionInfo(step.busLine, step.fromStop, step.toStop)?.stops.length! - 1,
                                 'bg-gray-300': stopIndex > 0 && stopIndex < getDirectionInfo(step.busLine, step.fromStop, step.toStop)?.stops.length! - 1
                               }">
                          </div>
                          <span :class="{
                            'font-medium': stopIndex === 0 || stopIndex === getDirectionInfo(step.busLine, step.fromStop, step.toStop)?.stops.length! - 1,
                            'text-gray-500': stopIndex > 0 && stopIndex < getDirectionInfo(step.busLine, step.fromStop, step.toStop)?.stops.length! - 1
                          }">
                            {{ stop.name }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Étape de correspondance -->
                    <div v-if="stepIndex < route.steps.length - 1 && step.type === 'bus' && route.steps[stepIndex + 1].type === 'bus'"
                         class="pl-4 border-l-2 border-orange-200">
                      <div class="flex items-center space-x-2 text-orange-500">
                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                          <span>↓</span>
                        </div>
                        <div>
                          <p class="font-medium">Correspondance à {{ step.toStop.name }}</p>
                          <p class="text-sm">
                            {{ Math.round(calculateDistance(
                              step.toStop.latitude,
                              step.toStop.longitude,
                              route.steps[stepIndex + 1].fromStop.latitude,
                              route.steps[stepIndex + 1].fromStop.longitude
                            ) * 1000) }}m jusqu'à l'arrêt du bus suivant
                          </p>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
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
import type { BusLine } from '~/server/data/mockData';
import BusStopSelect from './BusStopSelect.vue';
import { busLines } from '~/server/data';

interface BusStop {
  id: string
  name: string
  latitude: number
  longitude: number
  description: string
}

interface BusRouteStep {
  type: 'walk' | 'bus';
  busLine?: BusLine;
  fromStop: BusStop;
  toStop: BusStop;
  distance: number;
  stops?: BusStop[];
}

interface BusRoute {
  steps: BusRouteStep[];
  totalDistance: number;
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
const routes = ref<BusRoute[]>([]);

const allStops = computed(() => {
  const stopsMap = new Map<string, BusStop>();
  
  busLines.forEach(line => {
    line.stops.forEach(stop => {
      if (!stopsMap.has(stop.id)) {
        stopsMap.set(stop.id, {
          ...stop,
          description: `Ligne ${line.number}`
        });
      }
    });
  });
  
  return Array.from(stopsMap.values());
});

// Centre d'Abidjan
const ABIDJAN_CENTER: [number, number] = [5.3599, -4.0083];

const isFormValid = computed(() => {
  if (searchType.value === 'number') {
    return search.value.busNumber.trim() !== ''
  } else {
    return search.value.from.trim() !== '' && search.value.to.trim() !== ''
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

const drawBusLine = (line: BusLine) => {
  if (!map) return;
  clearMap();

  const coordinates = line.stops.map(stop => [stop.latitude, stop.longitude]);
  
  polyline = L.polyline(coordinates as L.LatLngExpression[], {
    color: line.color,
    weight: 4,
    opacity: 0.7
  }).addTo(map);

  line.stops.forEach((stop, index) => {
    const icon = L.divIcon({
      html: '•',
      className: 'custom-marker',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    const marker = L.marker([stop.latitude, stop.longitude], { icon });
    marker.addTo(map!);
    markers.push(marker);
  });

  const bounds = L.latLngBounds(coordinates as L.LatLngExpression[]);
  map.fitBounds(bounds, { padding: [50, 50] });
};

const drawMultiBusRoute = (route: BusRoute, options: { opacity?: number; color?: string } = {}) => {
  if (!map) return;
  clearMap();

  let allCoordinates: L.LatLngExpression[] = [];
  
  route.steps.forEach((step) => {
    if (step.type === 'bus' && step.stops) {
      const coordinates = step.stops.map(stop => [stop.latitude, stop.longitude] as L.LatLngExpression);
      
      const line = L.polyline(coordinates, {
        color: options.color || step.busLine?.color || '#3B82F6',
        weight: 4,
        opacity: options.opacity || 0.7
      }).addTo(map!);
      
      allCoordinates = [...allCoordinates, ...coordinates];
    }
  });

  // Add markers for all stops
  route.steps.forEach((step) => {
    if (step.type === 'bus' && step.stops) {
      step.stops.forEach((stop, index) => {
        const isEndpoint = index === 0 || index === step.stops!.length - 1;
        
        const icon = L.divIcon({
          html: isEndpoint ? '🚏' : '•',
          className: `custom-marker ${isEndpoint ? 'endpoint' : ''}`,
          iconSize: isEndpoint ? [24, 24] : [12, 12],
          iconAnchor: isEndpoint ? [12, 24] : [6, 6]
        });

        const marker = L.marker([stop.latitude, stop.longitude], { icon });
        marker.addTo(map!);
        markers.push(marker);
      });
    }
  });

  if (allCoordinates.length > 0) {
    const bounds = L.latLngBounds(allCoordinates);
    map.fitBounds(bounds, { padding: [50, 50] });
  }
};

const findAllPossibleRoutes = (fromStop: BusStop, toStop: BusStop): BusRoute[] => {
  const routes: BusRoute[] = [];
  const maxWalkingDistance = 1; // 1km maximum pour la marche

  // Fonction pour ajouter une route si elle n'existe pas déjà
  const addRouteIfUnique = (newRoute: BusRoute) => {
    const routeExists = routes.some(existingRoute => {
      if (existingRoute.steps.length !== newRoute.steps.length) return false;
      return existingRoute.steps.every((step, index) => {
        const newStep = newRoute.steps[index];
        if (step.type !== newStep.type) return false;
        if (step.type === 'bus') {
          return step.busLine?.number === newStep.busLine?.number &&
                 step.fromStop.id === newStep.fromStop.id &&
                 step.toStop.id === newStep.toStop.id;
        }
        return step.fromStop.id === newStep.fromStop.id &&
               step.toStop.id === newStep.toStop.id;
      });
    });

    if (!routeExists) {
      routes.push(newRoute);
    }
  };

  // 1. Rechercher les trajets directs en bus
  for (const line of busLines) {
    const fromStopIndex = line.stops.findIndex(s => s.id === fromStop.id);
    const toStopIndex = line.stops.findIndex(s => s.id === toStop.id);

    if (fromStopIndex !== -1 && toStopIndex !== -1) {
      // Créer le trajet dans le bon sens
      const isForward = fromStopIndex < toStopIndex;
      const stops = isForward
        ? line.stops.slice(fromStopIndex, toStopIndex + 1)
        : line.stops.slice(toStopIndex, fromStopIndex + 1).reverse();

      addRouteIfUnique({
        steps: [{
          type: 'bus',
          busLine: line,
          fromStop: fromStop,
          toStop: toStop,
          distance: calculateRouteDistance(stops),
          stops: stops
        }],
        totalDistance: calculateRouteDistance(stops)
      });
    }
  }

  // 2. Rechercher les trajets avec marche au début ou à la fin
  for (const line of busLines) {
    // Pour chaque arrêt de la ligne
    for (const lineStop of line.stops) {
      // Vérifier la marche depuis le point de départ
      const walkToStart = calculateDistance(
        fromStop.latitude,
        fromStop.longitude,
        lineStop.latitude,
        lineStop.longitude
      );

      if (walkToStart <= maxWalkingDistance) {
        // Chercher tous les arrêts possibles pour descendre
        for (const endStop of line.stops) {
          if (endStop.id === lineStop.id) continue;

          const walkToEnd = calculateDistance(
            endStop.latitude,
            endStop.longitude,
            toStop.latitude,
            toStop.longitude
          );

          if (walkToEnd <= maxWalkingDistance) {
            const fromIndex = line.stops.findIndex(s => s.id === lineStop.id);
            const toIndex = line.stops.findIndex(s => s.id === endStop.id);

            if (fromIndex !== -1 && toIndex !== -1) {
              const isForward = fromIndex < toIndex;
              const busStops = isForward
                ? line.stops.slice(fromIndex, toIndex + 1)
                : line.stops.slice(toIndex, fromIndex + 1).reverse();

              const steps: BusRouteStep[] = [];

              // Ajouter l'étape de marche initiale si nécessaire
              if (walkToStart > 0.05) {
                steps.push({
                  type: 'walk',
                  fromStop: fromStop,
                  toStop: lineStop,
                  distance: walkToStart
                });
              }

              // Ajouter l'étape en bus
              steps.push({
                type: 'bus',
                busLine: line,
                fromStop: lineStop,
                toStop: endStop,
                distance: calculateRouteDistance(busStops),
                stops: busStops
              });

              // Ajouter l'étape de marche finale si nécessaire
              if (walkToEnd > 0.05) {
                steps.push({
                  type: 'walk',
                  fromStop: endStop,
                  toStop: toStop,
                  distance: walkToEnd
                });
              }

              const totalDistance = steps.reduce((total, step) => total + step.distance, 0);
              addRouteIfUnique({ steps, totalDistance });
            }
          }
        }
      }

      // Vérifier la marche vers le point d'arrivée
      const walkFromEnd = calculateDistance(
        lineStop.latitude,
        lineStop.longitude,
        toStop.latitude,
        toStop.longitude
      );

      if (walkFromEnd <= maxWalkingDistance) {
        // Faire la même chose dans l'autre sens
        for (const startStop of line.stops) {
          if (startStop.id === lineStop.id) continue;

          const walkFromStart = calculateDistance(
            fromStop.latitude,
            fromStop.longitude,
            startStop.latitude,
            startStop.longitude
          );

          if (walkFromStart <= maxWalkingDistance) {
            const fromIndex = line.stops.findIndex(s => s.id === startStop.id);
            const toIndex = line.stops.findIndex(s => s.id === lineStop.id);

            if (fromIndex !== -1 && toIndex !== -1) {
              const isForward = fromIndex < toIndex;
              const busStops = isForward
                ? line.stops.slice(fromIndex, toIndex + 1)
                : line.stops.slice(toIndex, fromIndex + 1).reverse();

              const steps: BusRouteStep[] = [];

              // Ajouter l'étape de marche initiale si nécessaire
              if (walkFromStart > 0.05) {
                steps.push({
                  type: 'walk',
                  fromStop: fromStop,
                  toStop: startStop,
                  distance: walkFromStart
                });
              }

              // Ajouter l'étape en bus
              steps.push({
                type: 'bus',
                busLine: line,
                fromStop: startStop,
                toStop: lineStop,
                distance: calculateRouteDistance(busStops),
                stops: busStops
              });

              // Ajouter l'étape de marche finale si nécessaire
              if (walkFromEnd > 0.05) {
                steps.push({
                  type: 'walk',
                  fromStop: lineStop,
                  toStop: toStop,
                  distance: walkFromEnd
                });
              }

              const totalDistance = steps.reduce((total, step) => total + step.distance, 0);
              addRouteIfUnique({ steps, totalDistance });
            }
          }
        }
      }
    }
  }

  // Trier les routes par distance totale
  routes.sort((a, b) => a.totalDistance - b.totalDistance);

  // Retourner les 3 meilleures routes
  return routes.slice(0, 3);
};

const findDirectBusLine = (fromStop: BusStop, toStop: BusStop) => {
  for (const line of busLines) {
    const fromStopIndex = line.stops.findIndex(s => s.id === fromStop.id);
    const toStopIndex = line.stops.findIndex(s => s.id === toStop.id);
    
    if (fromStopIndex !== -1 && toStopIndex !== -1) {
      // On retourne l'itinéraire quel que soit le sens (aller ou retour)
      return {
        line,
        fromIndex,
        toIndex
      };
    }
  }
  return null;
};

const getDirectionInfo = (busLine: BusLine, fromStop: BusStop, toStop: BusStop) => {
  const fromIndex = busLine.stops.findIndex(s => s.id === fromStop.id);
  const toIndex = busLine.stops.findIndex(s => s.id === toStop.id);
  
  if (fromIndex === -1 || toIndex === -1) return null;

  // Déterminer le sens de circulation
  const isForward = fromIndex < toIndex;
  
  // Déterminer le terminus en fonction du sens
  const terminus = isForward ? busLine.stops[busLine.stops.length - 1] : busLine.stops[0];
  
  // Obtenir la liste des arrêts dans le bon ordre
  let stops;
  if (isForward) {
    stops = busLine.stops.slice(
      Math.min(fromIndex, toIndex),
      Math.max(fromIndex, toIndex) + 1
    );
  } else {
    stops = busLine.stops.slice(toIndex, fromIndex + 1).reverse();
  }
  
  return {
    direction: terminus.name,
    isForward,
    stops,
    numberOfStops: stops.length - 1
  };
};

const calculateRouteDistance = (stops: BusStop[]): number => {
  let distance = 0;
  for (let i = 1; i < stops.length; i++) {
    distance += calculateDistance(
      stops[i-1].latitude,
      stops[i-1].longitude,
      stops[i].latitude,
      stops[i].longitude
    );
  }
  return distance;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const findNearestStops = (latitude: number, longitude: number, maxDistance: number = 1): Array<{ stop: BusStop; distance: number; busLine: BusLine }> => {
  const nearestStops: Array<{ stop: BusStop; distance: number; busLine: BusLine }> = [];

  for (const line of busLines) {
    for (const stop of line.stops) {
      const distance = calculateDistance(latitude, longitude, stop.latitude, stop.longitude);
      if (distance <= maxDistance) {
        nearestStops.push({
          stop,
          distance,
          busLine: line
        });
      }
    }
  }

  return nearestStops.sort((a, b) => a.distance - b.distance);
};

const formatRouteInstructions = (route: BusRoute): string[] => {
  const instructions: string[] = [];
  
  for (const step of route.steps) {
    if (step.type === 'walk') {
      const distance = (step.distance * 1000).toFixed(0); // Convertir en mètres
      instructions.push(`🚶 Marcher ${distance}m jusqu'à l'arrêt ${step.toStop.name}`);
    } else if (step.type === 'bus' && step.busLine) {
      const directionInfo = getDirectionInfo(step.busLine, step.fromStop, step.toStop);
      
      if (directionInfo) {
        // Instruction principale avec la direction
        instructions.push(`🚌 Prendre le bus ${step.busLine.number} direction ${directionInfo.direction}`);
        
        // Détails des arrêts
        instructions.push(`   Monter à l'arrêt ${step.fromStop.name}`);
        
        // Liste des arrêts intermédiaires
        if (directionInfo.stops.length > 2) {
          const intermediateStops = directionInfo.stops.slice(1, -1);
          if (intermediateStops.length > 0) {
            instructions.push('   Arrêts traversés :');
            intermediateStops.forEach(stop => {
              instructions.push(`   • ${stop.name}`);
            });
          }
        }
        
        instructions.push(`   Descendre à l'arrêt ${step.toStop.name} (${directionInfo.numberOfStops} arrêt${directionInfo.numberOfStops > 1 ? 's' : ''})`);
      }
    }
  }
  
  // Ajouter la distance totale à la fin
  const totalDistance = route.totalDistance;
  const walkingDistance = route.steps
    .filter(step => step.type === 'walk')
    .reduce((total, step) => total + step.distance, 0);
  
  instructions.push(
    `\nℹ️ Distance totale : ${(totalDistance * 1000).toFixed(0)}m` +
    (walkingDistance > 0 ? ` (dont ${(walkingDistance * 1000).toFixed(0)}m de marche)` : '')
  );
  
  return instructions;
};

const getRouteTitle = (route: BusRoute, index: number): string => {
  // const busSteps = route.steps.filter(step => step.type === 'bus');
  // const walkSteps = route.steps.filter(step => step.type === 'walk');
  
  // const parts: string[] = [];
  
  // if (busSteps.length === 1) {
  //   parts.push(`Bus ${busSteps[0].busLine?.number}`);
  // } else if (busSteps.length > 1) {
  //   const busNumbers = busSteps.map(step => step.busLine?.number).join(' + ');
  //   parts.push(`${busSteps.length} bus (${busNumbers})`);
  // }
  
  // if (walkSteps.length > 0) {
  //   const totalWalkDistance = walkSteps.reduce((total, step) => total + step.distance, 0);
  //   if (totalWalkDistance > 0.05) { // Plus de 50m de marche
  //     parts.push(`${(totalWalkDistance * 1000).toFixed(0)}m de marche`);
  //   }
  // }
  
  // : ${parts.join(' + ')}
  return `Option ${index + 1}`;
};

const formatNumber = (busLine: string) => {
  return Number(busLine) < 10 ? `0${busLine}` : `${busLine}`;
};

const searchRoute = async () => {
  loading.value = true;
  busLine.value = null;
  routes.value = [];
  clearMap();
  
  try {
    if (searchType.value === 'number') {
      const line = formatNumber(search.value.busNumber);
      console.log('line', line);
      
      const foundLine = await $fetch(`/api/bus/line/${line}`);
      if (foundLine) {
        busLine.value = foundLine;
        drawBusLine(foundLine);
      }
    } else if (selectedFromStop.value && selectedToStop.value) {
      // Utiliser le nouvel algorithme pour trouver tous les itinéraires possibles
      routes.value = findAllPossibleRoutes(selectedFromStop.value, selectedToStop.value);

      // Dessiner tous les itinéraires trouvés sur la carte
      if (routes.value.length > 0) {
        // Dessiner le premier itinéraire en surbrillance
        drawMultiBusRoute(routes.value[0]);
        
        // Dessiner les autres itinéraires en plus clair
        for (let i = 1; i < routes.value.length; i++) {
          drawMultiBusRoute(routes.value[i], { opacity: 0.5, color: '#666' });
        }
      }
    }
    
    updateQueryParams();
  } catch (error) {
    console.error('Erreur lors de la recherche :', error);
  } finally {
    loading.value = false;
  }
};

const updateQueryParams = () => {
  const query: Record<string, string> = {};
  
  if (searchType.value === 'number' && search.value.busNumber) {
    query.number = search.value.busNumber;
  } else if (searchType.value === 'route' && selectedFromStop.value && selectedToStop.value) {
    query.from = selectedFromStop.value.name;
    query.to = selectedToStop.value.name;
  }
  
  router.replace({ query });
};

const initFromQueryParams = async () => {
  const { number, from, to } = route.query;

  if (number) {
    searchType.value = 'number';
    search.value.busNumber = number as string;
    await searchRoute();
  } else if (from && to) {
    searchType.value = 'route';
    // Trouver les arrêts correspondants
    const fromStop = busLines.flatMap(line => line.stops).find(stop => stop.name === from);
    const toStop = busLines.flatMap(line => line.stops).find(stop => stop.name === to);
    
    if (fromStop && toStop) {
      selectedFromStop.value = fromStop;
      selectedToStop.value = toStop;
      search.value.from = fromStop.name;
      search.value.to = toStop.name;
      await searchRoute();
    }
  }
};

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView(ABIDJAN_CENTER, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    initFromQueryParams();
  }
});

const onFromStopSelect = (stop: BusStop) => {
  selectedFromStop.value = stop;
  search.from = stop.name;
};

const onToStopSelect = (stop: BusStop) => {
  selectedToStop.value = stop;
  search.to = stop.name;
};

const invertRoute = () => {
  if (selectedFromStop.value && selectedToStop.value) {
    const tempFrom = selectedFromStop.value;
    const tempTo = selectedToStop.value;
    
    selectedFromStop.value = tempTo;
    selectedToStop.value = tempFrom;
    
    search.from = tempTo.name;
    search.to = tempFrom.name;
    
    nextTick(() => {
      searchRoute();
    });
  }
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

.custom-marker.endpoint {
  font-size: 1.5rem;
}

.custom-marker.highlighted {
  color: #2563eb;
  font-size: 1.4rem;
}

.custom-marker.faded {
  opacity: 0.4;
}
</style>