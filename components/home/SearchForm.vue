<template>
  <div class="container mx-auto px-4 -mt-16 relative z-20">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-lg bg-white shadow-lg p-8">
        <form class="grid grid-cols-1 sm:grid-cols-3 gap-6"@submit.prevent="handleCarSearch">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ville de départ</label>
            <CityAutocomplete
                v-model="from"
                @select="handleFromSelect"
                placeholder="Ville de départ"
              />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ville d'arrivée</label>
            <CityAutocomplete
              v-model="to"
              @select="handleToSelect"
              placeholder="Ville d'arrivée"
            />
          </div>
          <div class="flex flex-col justify-end">
           <AppButton label="Rechercher" :disabled="!isSearchEnabled" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// interface City {
//   name: string
//   code: string
// }

const router = useRouter()

// const selectedDeparture = ref<City | null>(null)
// const selectedArrival = ref<City | null>(null)
// const filteredDepartures = ref<City[]>([])
// const filteredArrivals = ref<City[]>([])

const from = ref('')
const to = ref('')
const searchStore = useSearchStore();

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


// const isFormValid = computed(() => {
//   return selectedDeparture.value && selectedArrival.value
// })

// const handleDepartureSelect = (event: { value: City }) => {
//   selectedDeparture.value = event.value
// }

// const handleArrivalSelect = (event: { value: City }) => {
//   selectedArrival.value = event.value
// }

// const handleSearch = async () => {
//   if (!isFormValid.value || !selectedDeparture.value || !selectedArrival.value) return

//   try {
//     await router.push({
//       path: '/result',
//       query: {
//         from: selectedDeparture.value.name,
//         to: selectedArrival.value.name
//       }
//     })
//   } catch (error) {
//     console.error('Navigation error:', error)
//   }
// }

onMounted(() => {
  searchStore.reset();
})
</script>