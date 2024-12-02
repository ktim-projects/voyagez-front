<template>
  <div class="relative">
    <input
      :value="modelValue"
      @input="handleInput"
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
          :key="suggestion.display_name"
          @click="selectSuggestion(suggestion)"
          class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
        >
          {{ suggestion.display_name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useVModel, onClickOutside, useDebounceFn } from '@vueuse/core';

interface Suggestion {
  display_name: string;
  lat: number;
  lon: number;
}

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const suggestions = ref<Suggestion[]>([]);
const showSuggestions = ref(false);
const suggestionsRef = ref<HTMLElement | null>(null);

const debouncedSearch = useDebounceFn(async (value: string) => {
  if (value.length < 3) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  try {
    const response = await $fetch('/api/places/autocomplete', {
      params: { input: value }
    });
    suggestions.value = response as Suggestion[];
    showSuggestions.value = true;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    suggestions.value = [];
  }
}, 300);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  debouncedSearch(value);
};

const selectSuggestion = (suggestion: Suggestion) => {
  emit('update:modelValue', suggestion.display_name);
  showSuggestions.value = false;
};

// Close suggestions when clicking outside
onClickOutside(suggestionsRef, () => {
  showSuggestions.value = false;
});
</script>