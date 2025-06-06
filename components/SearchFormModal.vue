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
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Départ</label>
                  <CityAutocomplete
                    :model-value="fromCity"
                    @update:model-value="$emit('update:fromCity', $event)"
                    @select="handleFromSelect"
                    placeholder="Ville de départ"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-2">Arrivée</label>
                  <CityAutocomplete
                    :model-value="toCity"
                    @update:model-value="$emit('update:toCity', $event)"
                    @select="handleToSelect"
                    placeholder="Ville d'arrivée"
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
                    variant="coral" 
                    label="Rechercher"
                    type="submit"
                    icon="Search"
                    :fullWidth="true"
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import type { City } from '../types'

const props = defineProps<{
  show: boolean
  fromCity: string
  toCity: string
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'update:fromCity': [value: string]
  'update:toCity': [value: string]
  'fromSelect': [value: City]
  'toSelect': [value: City]
  'submit': []
}>()

const handleFromSelect = (city: City) => {
  emit('fromSelect', city)
}

const handleToSelect = (city: City) => {
  emit('toSelect', city)
}

const handleSubmit = () => {
  emit('submit')
  emit('update:show', false)
}
</script>
