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
      class="w-full px-4 py-3 pr-16 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-corail-500 focus:border-transparent"
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
    
    <!-- Virtual Scroll Container -->
    <div 
      v-if="showSuggestions && suggestions.length > 0" 
      ref="suggestionsRef"
      class="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      <div 
        ref="scrollContainer"
        class="max-h-60 overflow-auto"
        @scroll="handleScroll"
      >
        <!-- Virtual scroll spacer top -->
        <div :style="{ height: `${topSpacer}px` }"></div>
        
        <!-- Visible items -->
        <div class="py-2">
          <div 
            v-for="(suggestion, index) in visibleSuggestions" 
            :key="suggestion.name"
            @click="handleSelect(suggestion)"
            class="px-4 py-2 hover:bg-corail-50 cursor-pointer transition-colors"
            :class="{
              'bg-corail-50': suggestion.originalIndex === selectedIndex,
              'bg-corail-100': normalizeText(suggestion.name) === normalizeText(props.modelValue)
            }"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span v-html="highlightMatch(suggestion.name)" class="text-gray-700 font-medium"></span>
                <span v-if="suggestion.countryFlag" class="text-lg" :title="suggestion.country">{{ suggestion.countryFlag }}</span>
              </div>
              <span class="text-gray-500 text-sm">{{ suggestion.region }}</span>
            </div>
          </div>
        </div>
        
        <!-- Virtual scroll spacer bottom -->
        <div :style="{ height: `${bottomSpacer}px` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { X } from 'lucide-vue-next';
import type { City } from '~/types';
import { useCities } from '~/composables/useCities';

const { cities } = useCities();

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  autoFocus?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'select', city: City): void;
}>();

const showSuggestions = ref(false);
const suggestions = ref<City[]>([]);
const suggestionsRef = ref(null);
const scrollContainer = ref(null);
const searchValue = ref('');
const inputRef = ref(null);
const selectedIndex = ref(-1);
const isSearching = ref(false);
const lastValidValue = ref('');

// Virtual scroll variables
const itemHeight = 48; // Height of each suggestion item in pixels
const visibleCount = 8; // Number of items to show at once
const scrollTop = ref(0);
const startIndex = ref(0);
const endIndex = ref(visibleCount);

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
  if (!value) return cities; // Return all cities when no search value
  
  const normalizedValue = normalizeText(value);
  return cities.filter(city => 
    normalizeText(city.name).includes(normalizedValue)
  ); // Return all matching cities, no limit
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
  // Si autoFocus est false et qu'il y a déjà une valeur, permettre le clic pour éditer
  if (props.autoFocus === false && props.modelValue && !isSearching.value) {
    searchValue.value = props.modelValue;
    lastValidValue.value = props.modelValue;
    isSearching.value = true;
    suggestions.value = filterCities(props.modelValue);
    showSuggestions.value = true;
    selectedIndex.value = -1;
    resetVirtualScroll();
    return;
  }
  
  if (!showSuggestions.value) {
    handleFocus();
  }
}

const handleFocus = () => {
  // Si autoFocus est false et qu'il y a déjà une valeur, ne pas afficher les suggestions
  if (props.autoFocus === false && props.modelValue && !isSearching.value) {
    return;
  }
  
  if (props.modelValue && !isSearching.value) {
    searchValue.value = props.modelValue;
    lastValidValue.value = props.modelValue;
    isSearching.value = true;
    suggestions.value = filterCities(props.modelValue);
  } else if (!isSearching.value) {
    suggestions.value = cities; // Show all cities
  } else {
    suggestions.value = filterCities(searchValue.value);
  }
  
  showSuggestions.value = true;
  selectedIndex.value = -1;
  resetVirtualScroll();
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
  
  suggestions.value = cities; // Show all cities
  showSuggestions.value = true;
  selectedIndex.value = -1;
  resetVirtualScroll();
  
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

// Virtual scroll computed properties
const visibleSuggestions = computed(() => {
  return suggestions.value
    .slice(startIndex.value, endIndex.value)
    .map((suggestion, index) => ({
      ...suggestion,
      originalIndex: startIndex.value + index
    }));
});

const topSpacer = computed(() => startIndex.value * itemHeight);
const bottomSpacer = computed(() => 
  Math.max(0, (suggestions.value.length - endIndex.value) * itemHeight)
);

// Virtual scroll methods
const handleScroll = () => {
  if (!scrollContainer.value) return;
  
  scrollTop.value = (scrollContainer.value as HTMLElement).scrollTop;
  const newStartIndex = Math.floor(scrollTop.value / itemHeight);
  
  startIndex.value = Math.max(0, newStartIndex);
  endIndex.value = Math.min(
    suggestions.value.length,
    startIndex.value + visibleCount + 2 // Buffer for smooth scrolling
  );
};

const resetVirtualScroll = () => {
  scrollTop.value = 0;
  startIndex.value = 0;
  endIndex.value = Math.min(visibleCount, suggestions.value.length);
  
  nextTick(() => {
    if (scrollContainer.value) {
      (scrollContainer.value as HTMLElement).scrollTop = 0;
    }
  });
};

const scrollToIndex = (index: number) => {
  if (!scrollContainer.value) return;
  
  const container = scrollContainer.value as HTMLElement;
  const targetScrollTop = index * itemHeight;
  const containerHeight = container.clientHeight;
  const currentScrollTop = container.scrollTop;
  
  // Check if item is visible
  if (targetScrollTop < currentScrollTop) {
    // Scroll up to show item
    container.scrollTop = targetScrollTop;
  } else if (targetScrollTop + itemHeight > currentScrollTop + containerHeight) {
    // Scroll down to show item
    container.scrollTop = targetScrollTop - containerHeight + itemHeight;
  }
};

watch(() => props.modelValue, (newValue) => {
  if (newValue && !isSearching.value) {
    lastValidValue.value = newValue;
  }
}, { immediate: true });

// Watch suggestions changes to reset virtual scroll
watch(() => suggestions.value.length, () => {
  resetVirtualScroll();
});

// Watch selectedIndex to scroll to selected item
watch(() => selectedIndex.value, (newIndex) => {
  if (newIndex >= 0) {
    scrollToIndex(newIndex);
  }
});
</script>

<style>
.highlight {
  background-color: transparent;
  color: #FA6B6B; /* corail-500 */
  font-weight: 500;
}
</style>