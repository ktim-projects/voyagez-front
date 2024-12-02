<template>
  <div :class="{ 'space-y-3': !compact }">
    <div class="flex justify-between items-start">
      <div>
        <div class="font-medium">{{ route.duration }}</div>
        <div class="text-sm text-gray-500">{{ route.distance }}</div>
      </div>
      <div class="text-right text-sm">
        <div class="font-medium">{{ route.from }}</div>
        <div class="text-gray-500">{{ route.to }}</div>
      </div>
    </div>

    <div v-if="!compact" class="space-y-2 mt-3">
      <div v-for="(step, index) in route.steps" :key="index" 
           class="flex items-start space-x-3">
        <div class="flex-shrink-0 mt-1">
          <div v-if="step.type === 'walk'" 
               class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <div v-else 
               class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
            <span class="text-xs font-medium text-primary-700">{{ step.line }}</span>
          </div>
        </div>
        <div class="flex-1">
          <div class="text-sm">{{ step.description }}</div>
          <div class="text-xs text-gray-500">{{ step.duration }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  route: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});
</script>