<template>
  <div class="relative">
    <input
      ref="inputRef"
      type="text"
      :value="displayValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleClick"
      @keydown="handleKeydown"
      :placeholder="placeholder"
      class="w-full px-4 py-3 pr-16 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
      :class="{ 'cursor-pointer': !isSearching, 'cursor-text': isSearching }"
      autocomplete="off"
    />
    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
      <button
        v-if="isSearching && searchValue"
        @click="clearSearch"
        class="mr-1 p-1 hover:bg-gray-100 rounded-full transition-colors"
        type="button"
      >
        <X class="h-4 w-4 text-gray-400 hover:text-gray-600" />
      </button>
    </div>
    
    <div 
      v-if="showSuggestions && suggestions.length > 0" 
      ref="suggestionsRef"
      class="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto"
    >
      <ul class="py-2">
        <li 
          v-for="(suggestion, index) in suggestions" 
          :key="suggestion.name"
          @click="handleSelect(suggestion)"
          class="px-4 py-2 hover:bg-coral-50 cursor-pointer transition-colors"
          :class="{
            'bg-coral-50': index === selectedIndex,
            'bg-coral-100': normalizeText(suggestion.name) === normalizeText(props.modelValue)
          }"
        >
          <div class="flex items-center justify-between">
            <span v-html="highlightMatch(suggestion.name)" class="text-gray-700 font-medium"></span>
            <span class="text-gray-500 text-sm">{{ suggestion.region }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { X } from 'lucide-vue-next';
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
const searchValue = ref('');
const inputRef = ref(null);
const selectedIndex = ref(-1);
const isSearching = ref(false);
const lastValidValue = ref('');

const displayValue = computed(() => {
  if (isSearching.value) {
    return searchValue.value;
  }
  return props.modelValue || '';
});

const normalizeText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const filterCities = (value: string): City[] => {
  if (!value) return cities.slice(0, 10);
  
  const normalizedValue = normalizeText(value);
  return cities.filter(city => 
    normalizeText(city.name).includes(normalizedValue)
  ).slice(0, 10);
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  searchValue.value = value;
  isSearching.value = true;
  
  // Filtrer les suggestions en temps réel
  suggestions.value = filterCities(value);
  showSuggestions.value = true;
  selectedIndex.value = -1;
}

const handleClick = () => {
  if (!showSuggestions.value) {
    handleFocus();
  }
}

const handleFocus = () => {
  if (props.modelValue && !isSearching.value) {
    searchValue.value = props.modelValue;
    lastValidValue.value = props.modelValue;
    isSearching.value = true;
    suggestions.value = filterCities(props.modelValue);
  } else if (!isSearching.value) {
    suggestions.value = cities.slice(0, 20);
  } else {
    suggestions.value = filterCities(searchValue.value);
  }
  
  showSuggestions.value = true;
  selectedIndex.value = -1;
}

const handleSelect = (city: City) => {
  searchValue.value = city.name;
  lastValidValue.value = city.name;
  isSearching.value = false;
  emit('update:modelValue', city.name);
  emit('select', city);
  showSuggestions.value = false;
  selectedIndex.value = -1;
}

const handleBlur = () => {
  setTimeout(() => {
    if (!showSuggestions.value) return;
    
    showSuggestions.value = false;
    selectedIndex.value = -1;
    
    if (isSearching.value && searchValue.value) {
      const exactMatch = cities.find(city => 
        normalizeText(city.name) === normalizeText(searchValue.value)
      );
      
      if (exactMatch) {
        lastValidValue.value = exactMatch.name;
        emit('update:modelValue', exactMatch.name);
        emit('select', exactMatch);
        isSearching.value = false;
      } else {
        
        searchValue.value = lastValidValue.value;
        emit('update:modelValue', lastValidValue.value);
        isSearching.value = false;
      }
    } else if (isSearching.value && !searchValue.value) {
      emit('update:modelValue', lastValidValue.value);
      isSearching.value = false;
    }
  }, 150);
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || suggestions.value.length === 0) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleFocus();
    }
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        handleSelect(suggestions.value[selectedIndex.value]);
      }
      break;
    case 'Escape':
      showSuggestions.value = false;
      selectedIndex.value = -1;
      break;
  }
}

const clearSearch = () => {
  searchValue.value = '';
  lastValidValue.value = '';
  isSearching.value = true;
  
  emit('update:modelValue', '');
  
  suggestions.value = cities.slice(0, 20);
  showSuggestions.value = true;
  selectedIndex.value = -1;
  
  if (inputRef.value) {
    (inputRef.value as HTMLInputElement).focus();
  }
}

const highlightMatch = (text: string) => {
  if (!searchValue.value) return text;
  if (normalizeText(text) === normalizeText(searchValue.value)) return text;
  const normalizedSearch = normalizeText(searchValue.value);
  const pattern = Array.from(normalizedSearch).map(char => 
    `[${char}${String.fromCharCode(char.charCodeAt(0) + 0x0300)}]`
  ).join('');
  const regex = new RegExp(`(${pattern})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

onClickOutside(suggestionsRef, (event) => {
  if (inputRef.value && event.target && (
    event.target === inputRef.value || 
    (inputRef.value as HTMLElement).contains(event.target as Node)
  )) {
    return;
  }
  showSuggestions.value = false;
  selectedIndex.value = -1;
  
  if (isSearching.value) {
    if (searchValue.value) {
      const exactMatch = cities.find(city => 
        normalizeText(city.name) === normalizeText(searchValue.value)
      );
      
      if (exactMatch) {
        lastValidValue.value = exactMatch.name;
        emit('update:modelValue', exactMatch.name);
        emit('select', exactMatch);
      } else {
        searchValue.value = lastValidValue.value;
        emit('update:modelValue', lastValidValue.value);
      }
    } else {
      emit('update:modelValue', lastValidValue.value);
    }
    isSearching.value = false;
  }
});

watch(() => props.modelValue, (newValue) => {
  if (newValue && !isSearching.value) {
    lastValidValue.value = newValue;
  }
}, { immediate: true });
</script>

<style>
.highlight {
  background-color: transparent;
  color: #FA6B6B; /* Coral-500 */
  font-weight: 500;
}
</style>