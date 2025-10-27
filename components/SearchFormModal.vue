<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="$emit('update:show', false)" class="relative z-50">
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                Modifier votre recherche
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="relative">
                  <label class="block text-sm font-medium text-gray-600 mb-2">Départ</label>
                  <CityAutocomplete
                    v-model="localFromCity"
                    @select="handleFromSelect"
                    placeholder="Ville de départ"
                    :auto-focus="!localFromCity"
                  />
                  
                  <!-- Swap Cities Button -->
                  <button
                    type="button"
                    @click="handleSwapCities"
                    :disabled="!localFromCity || !localToCity"
                    class="absolute -bottom-9 left-1/2 transform -translate-x-1/2 z-1000 p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    title="Inverser les villes"
                  >
                    <ArrowLeftRight class="w-4 h-4 text-gray-600 rotate-90" />
                  </button>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Arrivée</label>
                  <CityAutocomplete
                    v-model="localToCity"
                    @select="handleToSelect"
                    placeholder="Ville d'arrivée"
                    :auto-focus="!localToCity"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Disponibilité</label>
                  <div class="w-full p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Départs disponibles tous les jours
                  </div>
                </div>

                <div class="mt-6">
                  <AppButton 
                    variant="corail" 
                    label="Rechercher"
                    type="submit"
                    icon="Search"
                    :fullWidth="true"
                    :disabled="isSearchDisabled"
                  />
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ArrowLeftRight } from 'lucide-vue-next'
import type { City } from '~/types';

const props = withDefaults(defineProps<{
  show?: boolean
  fromCity?: string
  toCity?: string
  searchDisabled?: boolean
}>(), {
  show: false,
  fromCity: '',
  toCity: '',
  searchDisabled: false
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  'submit': [data: { from: string; to: string }]
}>()

// Valeurs locales pour le formulaire
const localFromCity = ref(props.fromCity)
const localToCity = ref(props.toCity)

// Computed pour désactiver le bouton
const isSearchDisabled = computed(() => {
  return !localFromCity.value || !localToCity.value || localFromCity.value === localToCity.value
})

// Synchroniser les valeurs locales quand le modal s'ouvre
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    localFromCity.value = props.fromCity
    localToCity.value = props.toCity
  }
})

const handleFromSelect = (city: City) => {
  localFromCity.value = city.name
}

const handleToSelect = (city: City) => {
  localToCity.value = city.name
}

const handleSwapCities = () => {
  const temp = localFromCity.value
  localFromCity.value = localToCity.value
  localToCity.value = temp
}

const handleSubmit = () => {
  // Émettre les valeurs locales au parent
  emit('submit', { from: localFromCity.value, to: localToCity.value })
  emit('update:show', false)
}
</script>
