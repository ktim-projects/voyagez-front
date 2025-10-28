<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleMenu"
      :disabled="disabled"
      class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
      :class="disabled 
        ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 cursor-not-allowed' 
        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      <span>{{ currentLabel }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform" :class="{'rotate-180': showMenu && !disabled}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showMenu"
        class="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
      >
        <div class="py-1">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="handleSelect(option.value)"
            class="w-full text-left px-4 py-2 text-sm transition-colors"
            :class="modelValue === option.value 
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';

interface SortOption {
  value: string;
  label: string;
}

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const showMenu = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Options de tri
const sortOptions: SortOption[] = [
  { value: '', label: 'Heure de départ' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'duration_asc', label: 'Durée la plus courte' }
];

// Label actuel
const currentLabel = computed(() => {
  const option = sortOptions.find(opt => opt.value === props.modelValue);
  return option ? option.label : 'Heure de départ';
});

// Toggle menu
const toggleMenu = () => {
  if (props.disabled) return;
  showMenu.value = !showMenu.value;
};

// Sélectionner une option
const handleSelect = (value: string) => {
  showMenu.value = false;
  emit('update:modelValue', value);
};

// Fermer le dropdown si on clique en dehors
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showMenu.value = false;
  }
};

// Ajouter/retirer l'écouteur de clic
watch(showMenu, (newValue) => {
  if (newValue) {
    // Utiliser nextTick pour éviter que le clic actuel ferme immédiatement le menu
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

// Nettoyer l'écouteur au démontage
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
