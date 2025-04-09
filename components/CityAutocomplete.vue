<template>
  <div class="relative">
    <input
      ref="inputRef"
      type="text"
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
      autocomplete="off"
    />
    
    <!-- Suggestions Dropdown -->
    <div 
      v-if="showSuggestions && suggestions.length > 0" 
      ref="suggestionsRef"
      class="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto"
    >
      <ul class="py-2">
        <li 
          v-for="suggestion in suggestions" 
          :key="suggestion.name"
          @click="handleSelect(suggestion)"
          class="px-4 py-2 hover:bg-coral-50 cursor-pointer"
          :class="{'bg-coral-50': normalizeText(suggestion.name) === normalizeText(searchValue)}"
        >
          <span v-html="highlightMatch(suggestion.name)" class="text-gray-700"></span>
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
const searchValue = ref('');
const inputRef = ref(null);

// Fonction pour normaliser le texte (retirer les accents)
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Fonction pour filtrer les villes
function filterCities(value: string): City[] {
  if (!value) return cities.slice(0, 10);
  
  const normalizedValue = normalizeText(value);
  return cities.filter(city => 
    normalizeText(city.name).includes(normalizedValue)
  ).slice(0, 10);
}

// Fonction pour vérifier si une valeur correspond exactement à une ville
function isExactMatch(value: string): boolean {
  if (!value) return false;
  const normalizedValue = normalizeText(value);
  return cities.some(city => normalizeText(city.name) === normalizedValue);
}

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  searchValue.value = value;
  emit('update:modelValue', value);
  
  suggestions.value = filterCities(value);
  showSuggestions.value = true;
}

function handleFocus() {
  if (props.modelValue) {
    searchValue.value = props.modelValue;
    if (isExactMatch(props.modelValue)) {
      showSuggestions.value = false;
      return;
    }
    suggestions.value = filterCities(props.modelValue);
  } else {
    searchValue.value = '';
    suggestions.value = filterCities('');
  }
  showSuggestions.value = true;
}

function handleSelect(city: City) {
  emit('update:modelValue', city.name);
  emit('select', city);
  showSuggestions.value = false;
}

function handleBlur() {
  // Ajouter la logique pour gérer le blur si nécessaire
}

function highlightMatch(text: string) {
  if (!searchValue.value) return text;
  if (normalizeText(text) === normalizeText(searchValue.value)) return text;
  // Créer une regex qui prend en compte les accents
  const normalizedSearch = normalizeText(searchValue.value);
  const pattern = Array.from(normalizedSearch).map(char => 
    `[${char}${String.fromCharCode(char.charCodeAt(0) + 0x0300)}]`
  ).join('');
  const regex = new RegExp(`(${pattern})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// Fermer les suggestions en cliquant en dehors
onClickOutside(suggestionsRef, () => {
  showSuggestions.value = false;
});
</script>

<style>
.highlight {
  background-color: transparent;
  color: #FA6B6B; /* Coral-500 */
  font-weight: 500;
}
</style>