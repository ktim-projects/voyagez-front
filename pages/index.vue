<template>
  <main class="min-h-screen">
    <!-- Hero Section avec animation de fond -->
    <section class="relative min-h-[85vh] flex items-center bg-gradient-to-br from-white to-blue-50">
      <!-- Formes décoratives -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-96 h-96 -top-48 -right-48 rounded-full bg-blue-100/50"></div>
        <div class="absolute w-96 h-96 -bottom-48 -left-48 rounded-full bg-indigo-100/50"></div>
      </div>

      <div class="relative w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Contenu Hero -->
          <div class="text-left space-y-8">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Voyagez en toute <span class="text-primary-600">simplicité</span> à travers la Côte d'Ivoire
            </h1>
            <p class="text-lg md:text-xl text-gray-600 max-w-2xl">
              Trouvez et comparez les meilleurs trajets cars et <s>bus</s> en quelques clics.
            </p>
          </div>

          <!-- Formulaire de recherche -->
          <div class="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <div class="flex space-x-4 mb-6">
              <button 
                @click="activeTab = 'car'"
                :class="[
                  'flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200',
                  activeTab === 'car' 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                Cars Interurbains
              </button>
              <button 
                @click="activeTab = 'bus'"
                disabled
                :class="[
                  'flex-1 py-3 px-4 text-sm font-medium rounded-xl transition-all duration-200 relative',
                  activeTab === 'bus' 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-50 cursor-not-allowed opacity-75'
                ]"
              >
                Bus Urbains
                <span class="absolute -top-2 -right-2 bg-primary-100 text-primary-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  À venir
                </span>
              </button>
            </div>

            <!-- Formulaire Cars -->
            <div v-if="activeTab === 'car'" class="space-y-4">
              <form @submit.prevent="handleCarSearch" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Départ</label>
                    <CityAutocomplete
                      v-model="from"
                      @select="handleFromSelect"
                      placeholder="Ville de départ"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Arrivée</label>
                    <CityAutocomplete
                      v-model="to"
                      @select="handleToSelect"
                      placeholder="Ville d'arrivée"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  :disabled="!isSearchEnabled"
                  :class="[
                    'w-full bg-gray-200 py-3 px-6 rounded-xl font-medium transition-all duration-200',
                    isSearchEnabled
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  Rechercher
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Destinations Populaires -->
    <PopularDestinations 
      :destinations="popularDestinations"
      @select="searchDestination"
    />

    <!-- Section Avantages -->
    <AdvantagesSection />

    <!-- Dernières actualités -->
    <LatestNews />

    <!-- FAQ Section -->
<FaqSection />
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CarCompany } from '~/server/data'

const router = useRouter();
const searchStore = useSearchStore();
const activeTab = ref('car')
const from = ref('')
const to = ref('')
const busSearch = ref('')

const isSearchEnabled = computed(() => {
  return from.value && to.value
})

const handleFromSelect = (city: any) => {
  searchStore.setSearchParams({
    from: city.name
  });
}

const handleToSelect = (city: any) => {
  searchStore.setSearchParams({
    to: city.name
  });
}

const handleCarSearch = async () => {
  if (!from.value || !to.value) return;

  searchStore.setSearchParams({
    type: 'car',
    from: from.value,
    to: to.value,
    date: null
  });

  await router.push('/results');
}

const searchDestination = async (destination: string) => {
  searchStore.setSearchParams({
    type: 'car',
    from: null,
    to: destination,
  });
  await router.push('/results');
}

onMounted(() => {
  searchStore.reset();
})

const popularDestinations = ref([
  {
    name: 'Yamoussoukro',
    description: 'La capitale politique',
    image: '/images/destinations/yakro.png'
  },
  {
    name: 'Bouaké',
    description: 'La deuxième plus grande ville',
    image: '/images/destinations/bouake.png'
  },
  {
    name: 'San Pedro',
    description: 'Le plus grand port',
    image: '/images/destinations/san-pedro.png'
  },
  {
    name: 'Korhogo',
    description: 'La ville des arts',
    image: '/images/destinations/korhogo.jpg'
  },
  {
    name: 'Man',
    description: 'La ville des montagnes',
    image: '/images/destinations/man.jpg'
  },
  {
    name: 'Grand-Bassam',
    description: 'L\'ancienne capitale',
    image: '/images/destinations/grand-bassam.jpg'
  }
])
</script>