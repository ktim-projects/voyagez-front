<template>
  <div class="hidden lg:flex lg:items-center lg:gap-2 lg:flex-wrap mb-4">
    <!-- Price Filter -->
    <FilterMenu
      title="Prix"
      :icon="Euro"
      :is-active="modelValue.maxPrice < 50000"
      @apply="emitUpdate"
      @reset="resetPriceFilter"
      class="inline-flex"
    >
      <div class="w-full">
        <input 
          type="range" 
          v-model="filters.maxPrice" 
          min="0" 
          max="50000" 
          step="1000"
          class="w-full"
        >
        <div class="text-sm text-gray-600 mt-2 text-center">
          {{ filters.maxPrice.toLocaleString() }} FCFA
        </div>
      </div>
    </FilterMenu>

    <!-- Companies Filter -->
    <FilterMenu
      title="Compagnies"
      :icon="Building"
      :is-active="modelValue.companies.length > 0"
      @apply="emitUpdate"
      @reset="resetCompaniesFilter"
      class="inline-flex"
    >
      <div class="space-y-2">
        <label 
          v-for="company in companies" 
          :key="company.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            v-model="filters.companies"
            :value="company.id"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          >
          <span class="ml-2 text-sm text-gray-700">{{ company.name }}</span>
        </label>
      </div>
    </FilterMenu>

    <!-- Departure Time Filter -->
    <FilterMenu
      title="Heure de départ"
      :icon="Clock"
      :is-active="!!modelValue.departurePeriod"
      @apply="emitUpdate"
      @reset="resetDepartureTimeFilter"
      class="inline-flex"
    >
      <div class="w-64 space-y-2">
        <label 
          v-for="(label, value) in departurePeriods" 
          :key="value"
          class="flex items-center"
        >
          <input
            type="radio"
            v-model="filters.departurePeriod"
            :value="value"
            class="text-primary-600 focus:ring-primary-500"
          >
          <span class="ml-2 text-sm text-gray-700">{{ label }}</span>
        </label>
      </div>
    </FilterMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Euro, Building, Clock } from 'lucide-vue-next';
import FilterMenu from './FilterMenu.vue';

interface Company {
  id: string;
  name: string;
}

interface Filters {
  maxPrice: number;
  companies: string[];
  departurePeriod: string;
}

const props = defineProps<{
  modelValue: Filters;
  companies: Company[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', filters: Filters): void;
}>();

const departurePeriods = {
  'morning': 'Matin (6h - 12h)',
  'afternoon': 'Après-midi (12h - 18h)',
  'evening': 'Soir (18h - 00h)',
  'night': 'Nuit (00h - 6h)'
};

const filters = ref<Filters>({
  maxPrice: props.modelValue.maxPrice,
  companies: [...props.modelValue.companies],
  departurePeriod: props.modelValue.departurePeriod
});

watch(() => props.modelValue, (newValue) => {
  filters.value = {
    maxPrice: newValue.maxPrice,
    companies: [...newValue.companies],
    departurePeriod: newValue.departurePeriod
  };
}, { deep: true });

const emitUpdate = () => {
  emit('update:modelValue', { ...filters.value });
};

const resetPriceFilter = () => {
  filters.value.maxPrice = 50000;
  emitUpdate();
};

const resetCompaniesFilter = () => {
  filters.value.companies = [];
  emitUpdate();
};

const resetDepartureTimeFilter = () => {
  filters.value.departurePeriod = '';
  emitUpdate();
};
</script>
