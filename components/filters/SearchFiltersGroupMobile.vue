<template>
  <div>
    <!-- Filters Sidebar/Modal -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-25 z-50"
        @click="closeModal"
      >
        <Transition
          enter-active-class="transform transition ease-out duration-300"
          enter-from-class="md:translate-x-full translate-y-full"
          enter-to-class="md:translate-x-0 translate-y-0"
          leave-active-class="transform transition ease-in duration-200"
          leave-from-class="md:translate-x-0 translate-y-0"
          leave-to-class="md:translate-x-full translate-y-full"
        >
          <div
            class="fixed md:inset-y-0 md:right-0 bottom-0 w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl z-[60] overflow-y-auto md:rounded-none rounded-t-xl max-h-[90vh] md:max-h-full"
            @click.stop
          >
            <!-- Header sticky -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Filtres</h3>
              <div class="flex items-center gap-2">
                <button 
                  v-if="hasActiveFilters"
                  @click="resetFilters"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center transition-colors"
                >
                  <RefreshCcwIcon class="w-4 h-4 mr-1" />
                  Réinitialiser
                </button>
                <button 
                  @click="closeModal"
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <XIcon class="w-6 h-6" />
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">

              <div class="space-y-6">
            <!-- Price Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
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
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                {{ filters.maxPrice.toLocaleString() }} FCFA
              </div>
            </div>

            <!-- Companies Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Compagnies
              </label>
              <div class="grid grid-cols-2 gap-2">
                <label 
                  v-for="company in companies" 
                  :key="company.id"
                  class="flex items-center"
                >
                  <input
                    type="checkbox"
                    v-model="filters.companies"
                    :value="company.id"
                    class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ company.name }}</span>
                </label>
              </div>
            </div>

            <!-- Departure Time Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Heure de départ
              </label>
              <select
                v-model="filters.departurePeriod"
                class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-primary-500 focus:ring-primary-500"
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
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Communes
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="filters.commune"
                    value=""
                    class="text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Toutes les communes</span>
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
                      class="text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                    >
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ commune }}</span>
                  </label>
                </div>
              </div>
            </div>
              </div>

              <!-- Sticky footer avec bouton -->
              <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 mt-6">
                <button 
                  @click="emitUpdate"
                  class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors font-medium"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
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
  showModal: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', filters: Filters): void;
  (e: 'update:showModal', value: boolean): void;
}>();

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

const closeModal = () => {
  emit('update:showModal', false);
};

const emitUpdate = () => {
  emit('update:modelValue', { ...filters.value });
  closeModal();
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
watch(() => props.showModal, (newValue) => {
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
