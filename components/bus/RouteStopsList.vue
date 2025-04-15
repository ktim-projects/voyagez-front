<template>
  <div class="route-stops-container">
    <div v-if="stops.length === 0" class="empty-stops">
      Aucun arrêt disponible
    </div>
    <div v-else class="relative space-y-4">
      <!-- Ligne verticale continue -->
      <div class="absolute left-3 top-3 bottom-3 w-0.5" :style="{ backgroundColor: `${routeColor}40` }"></div>
      
      <div 
        v-for="(stop, index) in stops" 
        :key="index"
        class="relative pl-8"
        @mouseenter="highlightedStop = index"
        @mouseleave="highlightedStop = null"
      >
        <!-- Point représentant l'arrêt -->
        <div 
          class="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center transition-colors"
          :class="{ 'border-blue-600': highlightedStop === index }"
          :style="{ borderColor: highlightedStop === index ? routeColor : routeColor + '40' }"
        >
          <div 
            class="w-2 h-2 rounded-full" 
            :style="{ backgroundColor: highlightedStop === index ? routeColor : routeColor + '40' }"
          ></div>
        </div>
        
        <!-- Informations sur l'arrêt -->
        <div class="py-1">
          <p class="font-medium text-gray-900 text-sm">{{ stop.name }}</p>
          <p v-if="stop.description" class="text-xs text-gray-500">{{ stop.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  stops: {
    type: Array as () => {
      id: string | number | undefined;
      name: string;
      description?: string;
      coordinates: [number, number] | null;
    }[],
    required: true
  },
  routeColor: {
    type: String,
    default: '#6C757D'
  }
});

// État pour suivre l'arrêt survolé
const highlightedStop = ref<number | null>(null);
</script>

<style scoped>
.route-stops-container {
  margin: 1rem 0;
}

.empty-stops {
  padding: 1rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}
</style>
