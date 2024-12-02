<template>
  <div class="relative">
    <input
      :value="modelValue"
      @input="handleInput"
      @focus="showAllSuggestions"
      type="text"
      class="input-field"
      :placeholder="placeholder"
      autocomplete="off"
    />
    
    <!-- Suggestions Dropdown -->
    <div 
      v-if="showSuggestions && suggestions.length > 0"
      ref="suggestionsRef"
      class="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
    >
      <ul class="py-1 max-h-60 overflow-auto">
        <li 
          v-for="suggestion in suggestions" 
          :key="suggestion.name"
          @click="selectSuggestion(suggestion)"
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
import { ref } from 'vue';
import { useVModel, onClickOutside } from '@vueuse/core';
import { cities } from '~/server/data';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  type: 'origin' | 'destination';
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const suggestions = ref(cities);
const showSuggestions = ref(false);
const suggestionsRef = ref<HTMLElement | null>(null);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  
  if (!value.trim()) {
    suggestions.value = cities;
  } else {
    suggestions.value = cities.filter(city => 
      city.name.toLowerCase().includes(value.toLowerCase()) ||
      city.region.toLowerCase().includes(value.toLowerCase())
    );
  }
  showSuggestions.value = true;
};

const showAllSuggestions = () => {
  suggestions.value = cities;
  showSuggestions.value = true;
};

const selectSuggestion = (suggestion: { name: string; region: string }) => {
  emit('update:modelValue', suggestion.name);
  showSuggestions.value = false;
};

// Close suggestions when clicking outside
onClickOutside(suggestionsRef, () => {
  showSuggestions.value = false;
});
</script>