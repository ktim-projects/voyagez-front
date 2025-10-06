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
        <div>
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
      <div class="flex justify-between items-center pt-1" :class="departure.comfort_info?.category ? 'border-t border-gray-100 dark:border-gray-700' : ''">
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
        
        <!-- <div class="block sm:hidden">
          <p class="text-base font-bold text-primary-600 dark:text-primary-400">
            {{ departure.price.toLocaleString() }} <span class="text-xs">FCFA</span>
          </p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Departure } from '~/server/data';
import { getComfortChipClasses } from '~/utils/comfort';
import { Clock as ClockIcon } from 'lucide-vue-next';


const props = defineProps<{
  departure: Departure;
}>();

const emit = defineEmits<{
  click: [departure: Departure];
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
  
</script>

<style scoped>
.result-card {
  box-shadow: rgba(19, 41, 104, 0.1) 0px 2px 5px 0px;
}
</style>
