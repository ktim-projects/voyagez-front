<template>
  <div class="relative">
    <div class="relative">
      <input
        type="text"
        :value="searchText"
        @input="onInput"
        :placeholder="placeholder"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    
    <div v-if="showDropdown && filteredStops.length > 0" 
         class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
      <ul class="py-1">
        <li v-for="stop in filteredStops" 
            :key="stop.id"
            @click="selectStop(stop)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <div class="font-medium text-sm">{{ stop.name }}</div>
          <div class="text-xs text-gray-500">{{ stop.description }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface BusStop {
  id: string
  name: string
  latitude: number
  longitude: number
  description: string
}

const props = defineProps<{
  modelValue: string
  placeholder?: string
  stops: BusStop[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'select', stop: BusStop): void
}>()

const searchText = ref(props.modelValue || '')
const showDropdown = ref(false)

// Surveiller les changements de modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchText.value) {
    searchText.value = newValue || ''
  }
})

const filteredStops = computed(() => {
  const search = searchText.value.toLowerCase().trim()
  if (!search) return props.stops
  
  return props.stops.filter(stop => 
    stop.name.toLowerCase().includes(search) || 
    stop.description?.toLowerCase().includes(search)
  )
})

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  searchText.value = input.value
  emit('update:modelValue', input.value)
  showDropdown.value = true
}

const selectStop = (stop: BusStop) => {
  searchText.value = stop.name
  emit('update:modelValue', stop.name)
  emit('select', stop)
  showDropdown.value = false
}

// Fermer le dropdown quand on clique en dehors
const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
