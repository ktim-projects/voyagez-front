<template>
  <div class="relative">
    <input
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      type="text"
      class="input-field"
      :placeholder="placeholder"
      autocomplete="off"
    />
    
    <!-- Suggestions Dropdown -->
    <div 
      v-if="showSuggestions" 
      ref="suggestionsRef"
      class="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
    >
      <ul>
        <li 
          v-for="suggestion in suggestions" 
          :key="suggestion.name"
          @click="handleSelect(suggestion)"
          class="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <div class="text-sm font-medium">{{ suggestion.name }}</div>
          <div class="text-xs text-gray-500">{{ suggestion.region }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { cities } from '~/server/data';

interface City {
  name: string;
  region: string;
}

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'select', city: City): void;
}>();

const showSuggestions = ref(false);
const suggestions = ref<City[]>([]);
const suggestionsRef = ref(null);

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  
  if (value.length > 0) {
    const filteredCities = cities.filter(city => 
      city.name.toLowerCase().includes(value.toLowerCase()) ||
      city.region.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10); // Limiter à 10 suggestions pour de meilleures performances
    suggestions.value = filteredCities;
    showSuggestions.value = true;
  } else {
    suggestions.value = cities.slice(0, 10);
    showSuggestions.value = true;
  }
}

function handleFocus() {
  suggestions.value = cities.slice(0, 10);
  showSuggestions.value = true;
}

function handleSelect(city: City) {
  emit('update:modelValue', city.name);
  emit('select', city);
  showSuggestions.value = false;
}

// Fermer les suggestions en cliquant en dehors
onClickOutside(suggestionsRef, () => {
  showSuggestions.value = false;
});
</script>