<template>
  <div>
    <!-- Mobile Filter Button -->
    <div class="lg:hidden mb-4">
      <button 
        @click="showModal = true"
        class="w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg flex items-center justify-between shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <div class="flex items-center">
          <FilterIcon class="w-4 h-4 mr-2 text-gray-500" />
          <span>Filtres</span>
        </div>
        <div class="flex items-center">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
            {{ activeFiltersCount }}
          </span>
        </div>
      </button>
    </div>

    <!-- Mobile Filters Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/50 lg:hidden"
      @click.self="showModal = false"
    >
      <div 
        class="bg-white w-full rounded-t-xl absolute bottom-0 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-800">Filtres</h3>
            <div class="flex items-center gap-4">
              <button 
                v-if="hasActiveFilters"
                @click="resetFilters"
                class="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                <RefreshCcwIcon class="w-4 h-4 mr-1" />
                Réinitialiser
              </button>
              <button 
                @click="showModal = false"
                class="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <XIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Price Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">
                Prix Maximum
              </label>
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

            <!-- Companies Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">
                Compagnies
              </label>
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
            </div>

            <!-- Departure Time Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">
                Heure de départ
              </label>
              <select
                v-model="filters.departurePeriod"
                class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Toute heure</option>
                <option value="morning">Matin (6h - 12h)</option>
                <option value="afternoon">Après-midi (12h - 18h)</option>
                <option value="evening">Soir (18h - 00h)</option>
                <option value="night">Nuit (00h - 6h)</option>
              </select>
            </div>

            <!-- Comfort Categories Filter -->
            <!-- <div v-if="comfortCategories.length > 0">
              <label class="block text-sm font-medium text-gray-600 mb-2">
                Catégorie
              </label>
              <div class="space-y-2">
                <label 
                  v-for="category in comfortCategories" 
                  :key="category"
                  class="flex items-center"
                >
                  <input
                    type="checkbox"
                    v-model="filters.comfortCategories"
                    :value="category"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ category }}</span>
                </label>
              </div>
            </div> -->

            <div v-if="isAbidjan">
              <label class="block text-sm font-medium text-gray-600 mb-2">
                Commune
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="filters.commune"
                    value=""
                    class="text-primary-600 focus:ring-primary-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Toutes les communes</span>
                </label>
                
                <div class="grid grid-cols-2 gap-2">
                  <label 
                    v-for="commune in ABIDJAN_COMMUNES" 
                    :key="commune"
                    class="flex items-center"
                  >
                    <input
                      type="radio"
                      v-model="filters.commune"
                      :value="commune"
                      class="text-primary-600 focus:ring-primary-500"
                    >
                    <span class="ml-2 text-sm text-gray-700">{{ commune }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button 
            @click="emitUpdate"
            class="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { FilterIcon, RefreshCcw as RefreshCcwIcon, X as XIcon } from 'lucide-vue-next';
import { ABIDJAN_COMMUNES } from '~/utils/communes';

interface Company {
  id: string;
  name: string;
}

interface Filters {
  maxPrice: number;
  companies: string[];
  departurePeriod: string;
  comfortCategories: string[];
  commune: string;
}

const props = defineProps<{
  modelValue: Filters;
  companies: Company[];
  comfortCategories: string[];
  fromCity: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', filters: Filters): void;
}>();

const showModal = ref(false);

const filters = ref<Filters>({
  maxPrice: props.modelValue.maxPrice,
  companies: [...props.modelValue.companies],
  departurePeriod: props.modelValue.departurePeriod,
  comfortCategories: [...props.modelValue.comfortCategories],
  commune: props.modelValue.commune
});

const isAbidjan = computed(() => {
  return props.fromCity?.toLowerCase() === 'abidjan';
});

const hasActiveFilters = computed(() => {
  return filters.value.maxPrice !== 50000 || 
         filters.value.companies.length > 0 || 
         filters.value.departurePeriod !== '' ||
         filters.value.comfortCategories.length > 0 ||
         filters.value.commune !== '';
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.maxPrice !== 50000) count++;
  if (filters.value.companies.length > 0) count++;
  if (filters.value.departurePeriod !== '') count++;
  if (filters.value.comfortCategories.length > 0) count++;
  if (filters.value.commune !== '') count++;
  return count;
});

const emitUpdate = () => {
  emit('update:modelValue', { ...filters.value });
  showModal.value = false;
};

const resetFilters = () => {
  filters.value = {
    maxPrice: 50000,
    companies: [],
    departurePeriod: '',
    comfortCategories: [],
    commune: ''
  };
  emitUpdate();
};

// Bloquer le scroll du body quand la modale est ouverte
watch(showModal, (newValue) => {
  if (!process.client) return;
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Nettoyer au démontage
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = '';
  }
});
</script>
