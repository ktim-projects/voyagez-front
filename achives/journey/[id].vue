<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <!-- En-tête du Trajet -->
      <div class="border-b pb-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <img :src="journey.operatorLogo" :alt="journey.operator" class="h-12">
            <div>
              <h1 class="text-2xl font-medium">{{ journey.origin }} → {{ journey.destination }}</h1>
              <p class="text-gray-600">{{ journey.date }} • {{ journey.operator }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-2xl font-medium text-primary-600">{{ journey.price.toLocaleString() }} FCFA</p>
            <p class="text-sm text-gray-500">par personne</p>
          </div>
        </div>
      </div>

      <!-- Détails du Trajet -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-xl font-medium mb-4">Détails du Trajet</h2>
          
          <!-- Arrêts de Bus -->
          <div class="relative pl-8 space-y-6">
            <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <template v-for="(stop, index) in journey.busStops" :key="index">
              <div class="relative">
                <div class="absolute left-[-1.875rem] w-4 h-4 rounded-full bg-white border-2 border-primary-600"></div>
                <div>
                  <p class="font-medium">{{ stop.name }}</p>
                  <p class="text-sm text-gray-500">{{ stop.time }}</p>
                </div>
              </div>
            </template>
          </div>

          <!-- Informations Supplémentaires -->
          <div class="mt-8">
            <h3 class="text-lg font-medium mb-4">Informations Pratiques</h3>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <span class="mr-2">Durée:</span>
                <span class="font-medium">{{ journey.duration }}</span>
              </li>
              <li class="flex items-center">
                <span class="mr-2">Distance:</span>
                <span class="font-medium">{{ journey.distance }}</span>
              </li>
              <li class="flex items-center">
                <span class="mr-2">Type:</span>
                <span class="font-medium">{{ journey.type }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Section Réservation -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h2 class="text-xl font-medium mb-4">Réserver votre trajet</h2>
          <form @submit.prevent="proceedToBooking" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre de passagers</label>
              <select v-model="bookingDetails.passengers" class="input-field">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} {{ n === 1 ? 'passager' : 'passagers' }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Type de passager</label>
              <select v-model="bookingDetails.passengerType" class="input-field">
                <option value="adult">Adulte</option>
                <option value="child">Enfant (2-11 ans)</option>
                <option value="senior">Senior (60+ ans)</option>
              </select>
            </div>

            <div class="pt-4">
              <div class="flex justify-between mb-2">
                <span>Prix du billet</span>
                <span>{{ journey.price.toLocaleString() }} FCFA</span>
              </div>
              <div class="flex justify-between mb-2">
                <span>Passagers</span>
                <span>x {{ bookingDetails.passengers }}</span>
              </div>
              <div class="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>{{ totalPrice.toLocaleString() }} FCFA</span>
              </div>
            </div>

            <button type="submit" class="w-full bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors text-sm">
              Continuer vers le paiement
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const journeyId = route.params.id;

const bookingDetails = ref({
  passengers: 1,
  passengerType: 'adult'
});

// Données simulées du trajet
const journey = ref({
  id: journeyId,
  operator: 'TranSenegal',
  operatorLogo: '/images/transsenegal-logo.png',
  type: 'Bus',
  origin: 'Dakar',
  destination: 'Touba',
  date: '15 Mars 2024',
  departureTime: '09:00',
  arrivalTime: '11:30',
  duration: '2h 30min',
  distance: '200 km',
  departureStation: 'Gare Routière de Dakar',
  arrivalStation: 'Gare Routière de Touba',
  price: 5000,
  busStops: [
    { name: 'Dakar Gare Routière', time: '09:00' },
    { name: 'Rufisque', time: '09:45' },
    { name: 'Thiès', time: '10:30' },
    { name: 'Touba', time: '11:30' }
  ]
});

const totalPrice = computed(() => {
  return journey.value.price * bookingDetails.value.passengers;
});

const proceedToBooking = () => {
  navigateTo({
    path: '/booking/payment',
    query: {
      journeyId: journeyId,
      passengers: bookingDetails.value.passengers,
      type: bookingDetails.value.passengerType,
      total: totalPrice.value
    }
  });
};
</script>