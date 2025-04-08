<template>
  <div 
    class="bg-white rounded-xl p-6 transition-opacity duration-200 cursor-pointer hover:shadow-md result-card"
    @click="$emit('click', departure)"
  >
    <div class="flex flex-col">
      <!-- En-tête avec opérateur et prix -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <img 
            v-if="departure.company?.logo_url"
            :src="departure.company.logo_url" 
            :alt="departure.company.name" 
            class="h-8 w-8 mr-3 object-contain"
          />
          <h3 class="text-lg font-semibold text-gray-800">
            {{ departure.company?.name }}
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
          <p class="text-sm text-gray-600">{{ departure.origin }} - <span class="text-xs text-gray-400">{{ departure.departure_station }}</span></p>
        </div>
        <div class="text-center">
          <p class="text-xs text-gray-500">Durée (estimée)</p>
          <p class="font-medium">{{ formatDuration(departure.duration) }}</p>
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
</template>

<script setup lang="ts">
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
  departure_station: string;
}

const props = defineProps<{
  departure: Departure;
}>();

defineEmits<{
  (e: 'click', departure: Departure): void;
}>();

</script>

<style scoped>
.result-card {
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(19, 41, 104, 0.2) 0px 2px 5px 0px;
}
</style>
