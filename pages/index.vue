<template>
  <main>
    <!-- Hero Section avec animation de fond -->
    <section class="relative bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800 py-20 overflow-hidden">
      <!-- Formes animées en arrière-plan -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute top-48 -right-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-24 left-48 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-4">Trouvez votre trajet idéal</h1>
          <p class="text-xl text-gray-600">Comparez les cars et trouvez les horaires de bus en un clic</p>
        </div>

        <!-- Onglets -->
        <div class="max-w-3xl mx-auto">
          <div class="flex justify-center mb-6">
            <button 
              @click="activeTab = 'car'"
              :class="[
                'px-6 py-2 text-sm font-medium rounded-l-lg transition-colors',
                activeTab === 'car' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              ]"
            >
              Cars Interurbains
            </button>
            <button 
              @click="activeTab = 'bus'"
              :class="[
                'px-6 py-2 text-sm font-medium rounded-r-lg transition-colors',
                activeTab === 'bus' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'bg-transparent text-gray-600 hover:bg-white/50'
              ]"
            >
              Bus Urbains
            </button>
          </div>

          <!-- Formulaire de recherche Cars -->
          <div v-if="activeTab === 'car'" class="bg-white rounded-lg shadow-lg p-6 transition-all duration-300">
            <form @submit.prevent="handleCarSearch" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="from" class="block text-sm font-medium text-gray-700">Départ</label>
                  <CityAutocomplete
                    v-model="carSearch.from"
                    type="origin"
                    placeholder="Ville de départ"
                  />
                </div>
                <div>
                  <label for="to" class="block text-sm font-medium text-gray-700">Arrivée</label>
                  <CityAutocomplete
                    v-model="carSearch.to"
                    type="destination"
                    placeholder="Ville d'arrivée"
                  />
                </div>
              </div>

              <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    id="date"
                    v-model="carSearch.date"
                    type="date"
                    class="input-field"
                  />
                </div>
                <div>
                  <label for="passengers" class="block text-sm font-medium text-gray-700">Passagers</label>
                  <select
                    id="passengers"
                    v-model="carSearch.passengers"
                    class="input-field"
                  >
                    <option v-for="n in 9" :key="n" :value="n">{{ n }} {{ n === 1 ? 'passager' : 'passagers' }}</option>
                  </select>
                </div>
              </div> -->

              <button 
                type="submit" 
                class="w-full btn-primary py-3"
                :disabled="!isCarSearchValid"
              >
                Rechercher un car
              </button>
            </form>
          </div>

          <!-- Formulaire de recherche Bus -->
          <div v-else class="bg-white rounded-lg shadow-lg p-6 transition-all duration-300">
            <form @submit.prevent="handleBusSearch" class="space-y-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Type de recherche</label>
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="busSearch.searchType" 
                      value="number" 
                      class="form-radio"
                    >
                    <span class="ml-2 text-sm">Par numéro de bus</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      v-model="busSearch.searchType" 
                      value="route" 
                      class="form-radio"
                    >
                    <span class="ml-2 text-sm">Par trajet</span>
                  </label>
                </div>
              </div>

              <template v-if="busSearch.searchType === 'number'">
                <div>
                  <label for="busNumber" class="block text-sm font-medium text-gray-700">Numéro de bus</label>
                  <input
                    id="busNumber"
                    v-model="busSearch.busNumber"
                    type="text"
                    class="input-field"
                    placeholder="Ex: 32"
                  />
                </div>
              </template>

              <template v-else>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="busFrom" class="block text-sm font-medium text-gray-700">Point de départ</label>
                    <AddressAutocomplete
                      v-model="busSearch.from"
                      placeholder="Arrêt de départ"
                    />
                  </div>
                  <div>
                    <label for="busTo" class="block text-sm font-medium text-gray-700">Point d'arrivée</label>
                    <AddressAutocomplete
                      v-model="busSearch.to"
                      placeholder="Arrêt d'arrivée"
                    />
                  </div>
                </div>
              </template>

              <button 
                type="submit" 
                class="w-full btn-primary py-3"
                :disabled="!isBusSearchValid"
              >
                Rechercher un bus
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Destinations Populaires -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Destinations Populaires</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="destination in popularDestinations" :key="destination.id" 
               class="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
            <div class="relative overflow-hidden">
              <img :src="destination.image" :alt="destination.name" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ destination.name }}</h3>
              <p class="text-gray-600 mb-4">{{ destination.description }}</p>
              <button @click="searchDestination(destination)" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Trouver un trajet
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Preview -->
    <BlogPreview />
  </main>
</template>

<script setup lang="ts">

const activeTab = ref('car');

const carSearch = ref({
  from: '',
  to: '',
  date: '',
  passengers: 1
});

const busSearch = ref({
  searchType: 'number',
  busNumber: '',
  from: '',
  to: ''
});

const popularDestinations = ref([
  {
    id: 1,
    name: 'Yamoussoukro',
    description: 'Découvrez la capitale politique',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80'
  },
  {
    id: 2,
    name: 'Bouaké',
    description: 'La deuxième plus grande ville',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80'
  },
  {
    id: 3,
    name: 'San Pedro',
    description: 'Le plus grand port de la région',
    image: 'https://images.unsplash.com/photo-1576924542622-772281dba3d6?w=500&q=80'
  }
]);

const isCarSearchValid = computed(() => {
  return carSearch.value.from && carSearch.value.to
});

const isBusSearchValid = computed(() => {
  if (busSearch.value.searchType === 'number') {
    return !!busSearch.value.busNumber;
  }
  return !!busSearch.value.from && !!busSearch.value.to;
});

const handleCarSearch = () => {
  navigateTo({
    path: '/search',
    query: {
      type: 'car',
      from: carSearch.value.from,
      to: carSearch.value.to,
      date: carSearch.value.date,
      passengers: carSearch.value.passengers
    }
  });
};

const handleBusSearch = () => {
  const query: any = { type: 'bus' };
  
  if (busSearch.value.searchType === 'number') {
    query.number = busSearch.value.busNumber;
  } else {
    query.from = busSearch.value.from;
    query.to = busSearch.value.to;
  }
  
  navigateTo({
    path: '/search',
    query
  });
};

const searchDestination = (destination: any) => {
  carSearch.value.to = destination.name;
  handleCarSearch();
};

// SEO
useHead({
  title: 'VoyagezCi - Trouvez le meilleur itinéraire',
  meta: [
    {
      name: 'description',
      content: 'Comparez et trouvez les meilleurs itinéraires de bus et cars en Côte d\'Ivoire'
    }
  ]
});
</script>

<style>
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>