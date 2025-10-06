<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-xl px-4 py-2 transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.01] group result-card"
    @click="$emit('click', departure)"
  >
    <div class="flex flex-col">
      <!-- En-tête avec opérateur et prix -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <div class="relative h-8 w-8 mr-2 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <img 
              v-if="departure.company?.logo_url"
              :src="departure.company.logo_url" 
              :alt="departure.company.name" 
              class="h-8 w-8 object-contain"
            />
            <span v-else class="text-sm font-bold text-primary-600 dark:text-primary-400">
              {{ getInitials(departure.company?.name) }}
            </span>
          </div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {{ departure.company?.name }}
          </h3>
        </div>
        <div class="hidden sm:block">
          <p class="text-lg font-bold text-primary-600 dark:text-primary-400 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors duration-300">
            {{ departure.price.toLocaleString() }} <span class="text-sm">FCFA</span>
          </p>
        </div>
      </div>

      <!-- Informations de voyage en format compact -->
      <div class="grid grid-cols-12 gap-2 mb-3">
        <!-- Départ -->
        <div class="col-span-5">
          <div class="flex items-center">
            <!-- <div class="h-3 w-3 rounded-full bg-primary-600 mr-2"></div> -->
            <p class="font-medium text-sm dark:text-gray-200">{{ formatTime(departure.departure_time) }}</p>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400">{{ departure.origin }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ departure.station }}</p>
        </div>
        
        <!-- Durée -->
        <div class="col-span-2 flex flex-col items-center justify-center">
          <p class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap sm:whitespace-normal">{{ formatDuration(departure.duration) }}</p>
          <div class="w-full h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
          <ClockIcon class="h-3 w-3 text-gray-400 dark:text-gray-500" />
        </div>
        
        <!-- Arrivée -->
        <div class="col-span-5 text-right">
          <div class="flex items-center justify-end">
            <p class="font-medium text-sm dark:text-gray-200">{{ formatTime(departure.arrival_time) }}</p>
            <!-- <div class="h-3 w-3 rounded-full bg-coral-500 ml-2"></div> -->
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400">{{ departure.destination }}</p>
        </div>
      </div>

      <!-- Informations supplémentaires -->
      <div class="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-1">
        <!-- Comfort info -->
        <div class="flex items-center space-x-2">
          <div v-if="departure.comfort_info?.category" 
               :class="getComfortChipClasses(departure.comfort_info.category)"
               class="px-2 py-1 rounded-full text-xs font-medium cursor-help transition-all duration-200 hover:scale-105 relative"
               @click.stop
               @mouseenter="showTooltip = true"
               @mouseleave="showTooltip = false">
            {{ departure.comfort_info.category }}
            
            <!-- Tooltip personnalisée -->
            <div v-show="showTooltip" class="absolute bottom-full mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg transition-opacity duration-200 pointer-events-none z-10 left-0 transform w-max" style="max-width: 400px;">
              {{ departure.comfort_info.details }}
              <!-- Flèche -->
              <div class="absolute top-full left-4 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          </div>
        </div>
        
        <div class="block sm:hidden">
          <p class="text-base font-bold text-primary-600 dark:text-primary-400">
            {{ departure.price.toLocaleString() }} <span class="text-xs">FCFA</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock as ClockIcon, Wifi as WifiIcon, AirVent, Toilet, UtensilsCrossed } from 'lucide-vue-next';

interface Company {
  id: string;
  name: string;
  logo_url?: string;
}

interface Departure {
  id: string;
  company?: Company;
  price: number;
  departure_time: string;
  arrival_time: string;
  duration: number;
  origin: string;
  destination: string;
  station: string;
  comfort_info?: {
    category: string;
    details: string;
  }
}

 defineProps<{
  departure: Departure;
}>();
defineEmits<{
  (e: 'click', departure: Departure): void;
}>();

const showTooltip = ref(false);


const getInitials = (name?: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getComfortChipClasses = (category: string) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Palette de couleurs douces et subtiles
  const colorPalette = [
    'bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300',
    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300',
    'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300',
    'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300',
    'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300',
    'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300',
    'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300',
    'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300',
    'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300',
    'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-300',
    'bg-lime-50 text-lime-600 dark:bg-lime-900/20 dark:text-lime-300',
    'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-300'
  ];
  
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};
  
</script>

<style scoped>
.result-card {
  box-shadow: rgba(19, 41, 104, 0.1) 0px 2px 5px 0px;
}
</style>
