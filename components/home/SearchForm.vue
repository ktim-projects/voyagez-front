<template>
  <div class="container mx-auto px-4  md:-mt-24 relative z-20 search-form-section">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
        <!-- Onglets de type de transport -->
        <div class="flex mb-6 border-b border-gray-200 dark:border-gray-700">
          <button 
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="activeTab = tab.value"
            class="px-4 py-3 text-sm font-medium transition-all duration-300 relative"
            :class="[
              activeTab === tab.value 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            <div class="flex items-center gap-2">
              <component :is="tab.icon" class="h-5 w-5" />
              <span>{{ $t(tab.label) }}</span>
            </div>
            <div 
              v-if="activeTab === tab.value"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 transform transition-transform duration-300"
            ></div>
          </button>
        </div>
        
        <!-- Formulaire de recherche de voiture (affiché uniquement quand activeTab === 'car') -->
        <form v-if="activeTab === 'car'" class="grid grid-cols-1 sm:grid-cols-3 gap-4" @submit.prevent="handleSearch">
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('search.departureCity') }}</label>
            <div class="relative">
              <!-- <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
              </div> -->
              <CityAutocomplete
                v-model="from"
                @select="handleFromSelect"
                :placeholder="$t('search.departurePlaceholder')"
                class="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-300"
              />
            </div>
          </div>
          
          <div class="group">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('search.arrivalCity') }}</label>
            <div class="relative">
              <!-- <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-300" />
              </div> -->
              <CityAutocomplete
                v-model="to"
                @select="handleToSelect"
                :placeholder="$t('search.arrivalPlaceholder')"
                class="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-300"
              />
            </div>
          </div>
          
          <div class="flex flex-col justify-end">
            <AppButton 
              type="submit" 
              variant="coral" 
              :label="$t('search.searchButton')" 
              :disabled="!isSearchEnabled"
              class="h-[46px] rounded-xl transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-coral-500/30"
            />
          </div>
        </form>

        <!-- Formulaire de recherche de bus (affiché uniquement quand activeTab === 'bus') -->
        <form v-if="activeTab === 'bus'" class="space-y-6" @submit.prevent="handleBusSearch">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('busSearch.busNumber') }}</label>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-2 align-center items-center justify-center">
              <div class="w-full sm:w-3/4">
                <input
                  v-model="busNumber"
                  type="text"
                  class="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  :placeholder="$t('busSearch.busNumberPlaceholder')"
                />
              </div>
              <div class="w-full sm:w-1/4 mt-3 sm:mt-0">
                <AppButton 
                  type="submit" 
                  variant="coral" 
                  :label="$t('busSearch.searchButton')" 
                  :disabled="!isBusSearchEnabled"
                  class="w-full h-[46px] rounded-xl transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-coral-500/30"
                />
              </div>
            </div>
          </div>
        </form>
        
        <!-- Suggestions populaires (uniquement pour la recherche de voiture) -->
        <div v-if="activeTab === 'car'" class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ $t('search.popularSearches') }}</p>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="(city, index) in popularCities" 
              :key="index"
              @click="quickSearch(city)"
              class="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              {{ city }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { CarIcon, BusIcon, TrainIcon, MapPinIcon } from 'lucide-vue-next';

const router = useRouter();

const from = ref('');
const to = ref('');
const busNumber = ref('');
const searchStore = useSearchStore();
const activeTab = ref('car');

const tabs = [
  { 
    label: 'search.tabs.car',
    value: 'car',
    icon: CarIcon
  },
  { 
    label: 'search.tabs.bus',
    value: 'bus',
    icon: BusIcon
  },
];

const popularCities = ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San Pedro', 'Korhogo'];

const isSearchEnabled = computed(() => {
  return from.value && to.value;
});

const isBusSearchEnabled = computed(() => {
  return busNumber.value;
});

const handleFromSelect = (city: any) => {
  searchStore.setSearchParams({
    from: city.name
  });
};

const handleToSelect = (city: any) => {
  searchStore.setSearchParams({
    to: city.name
  });
};

const handleSearch = async () => {
  if (!from.value || !to.value) return;

  searchStore.setSearchParams({
    type: activeTab.value as 'car' | 'bus',
    from: from.value,
    to: to.value,
    date: null
  });

  // Naviguer vers la page de résultats avec les query params
  await router.push({ 
    path: '/results',
    query: searchStore.getQueryParams()
  });
};

const handleBusSearch = async () => {
  if (!busNumber.value.trim()) return;
  
  // Mettre à jour le store avec le type 'bus' et le numéro de bus
  searchStore.setSearchParams({
    type: 'bus',
    busNumber: busNumber.value.trim(),
    from: null,
    to: null
  });

  // Rediriger vers la page de résultats avec les query params
  await router.push({ 
    path: '/results',
    query: searchStore.getQueryParams()
  });
};

const quickSearch = async (destination: string) => {
  searchStore.setSearchParams({
    type: activeTab.value as 'car' | 'bus',
    from: null,
    to: destination,
  });
  
  await router.push({ 
    path: '/results',
    query: searchStore.getQueryParams()
  });
};

onMounted(() => {
  searchStore.reset();
});
</script>

<style scoped>
/* Animation pour les transitions */
.group:hover label {
  color: var(--color-primary-600);
  transition: color 0.3s ease;
}
</style>