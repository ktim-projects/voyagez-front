<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-25 z-50"
      @click="$emit('update:modelValue', null)"
    >
      <Transition
        enter-active-class="transform transition ease-out duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition ease-in duration-200"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          class="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl z-[60] overflow-y-auto"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-[70] shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800">Détails du trajet</h3>
            <button
              @click="$emit('update:modelValue', null)"
              class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <div v-if="modelValue" class="space-y-6">
              <!-- Company Info -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img 
                    v-if="modelValue.company?.logo_url"
                    :src="modelValue.company.logo_url" 
                    :alt="modelValue.company.name"
                    class="h-10 w-10 mr-3 object-contain"
                  />
                  <div>
                    <h4 class="font-medium text-gray-900">{{ modelValue.company?.name }}</h4>
                    <p class="text-sm text-gray-500">Transport routier</p>
                  </div>
                </div>
                <p class="text-lg font-bold text-primary-600">
                  {{ modelValue.price.toLocaleString() }} FCFA
                </p>
              </div>

              <!-- Journey Details -->
              <div class="border border-gray-200 rounded-lg p-4 space-y-4">
                <div class="flex items-start">
                  <div class="w-1/3">
                    <p class="text-sm text-gray-500">Départ</p>
                    <p class="font-medium">{{ formatTime(modelValue.departure_time) }}</p>
                    <p class="text-sm text-gray-600">{{ displayOrigin }}</p>
                    <p class="text-xs text-gray-400">{{ modelValue.station }}</p>
                  </div>
                  <div class="w-1/3 text-center">
                    <p class="text-sm text-gray-500">Durée</p>
                    <p class="font-medium">{{ formatDuration(modelValue.duration) }}</p>
                  </div>
                  <div class="w-1/3 text-right">
                    <p class="text-sm text-gray-500">Arrivée</p>
                    <p class="font-medium">{{ formatTime(modelValue.arrival_time) }}</p>
                    <p class="text-sm text-gray-600">{{ displayDestination }}</p>
                  </div>
                </div>
              </div>

              <!-- Comfort Section -->
              <div v-if="modelValue.comfort_info?.category" class="border border-gray-200 rounded-lg p-4">
                <!-- Header with title and chip -->
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-900">Catégorie de confort</h4>
                  <span 
                    :class="getComfortChipClasses(modelValue.comfort_info.category)"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {{ modelValue.comfort_info.category }}
                  </span>
                </div>
                
                <!-- Comfort Details as bullet points -->
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li 
                    v-for="detail in parseComfortDetails(modelValue.comfort_info.details)" 
                    :key="detail"
                    class="flex items-start"
                  >
                    <span class="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>{{ detail }}</span>
                  </li>
                </ul>
              </div>

              <!-- Contact Section -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Contact</h4>
                <div class="space-y-2">
                  <a 
                    :href="'tel:' + modelValue?.company?.phone"
                    class="flex items-center text-sm"
                  >
                    <PhoneIcon class="w-4 h-4 mr-2" />
                    {{ modelValue?.company?.phone || '08 99 99 99 99' }}
                  </a>
                  <a 
                    :href="'https://maps.google.com/?q=' + modelValue?.company?.address"
                    target="_blank"
                    class="flex items-center text-sm"
                  >
                    <MapPinIcon class="w-4 h-4 mr-2" />
                    {{ modelValue?.company?.address || 'adresse@test' }}
                  </a>
                </div>
              </div>

              <!-- Services Section -->
              <div v-if="modelValue.company?.services?.length" class="border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">Services</h4>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="service in modelValue.company.services" 
                    :key="service"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ service }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { XIcon, PhoneIcon, MapPinIcon } from 'lucide-vue-next';
import { getComfortChipClasses, parseComfortDetails } from '~/utils/comfort';
import { getCityFromSlug } from '~/utils/cities';

interface Company {
  id: string;
  name: string;
  logo_url?: string;
  phone?: string;
  address?: string;
  services?: string[];
}

interface Departure {
  id: string;
  company?: Company;
  price: number;
  departure_time: string;
  arrival_time: string;
  duration: number;
  origin: string;
  destination: string;
  station: string;
  comfort_info?: {
    category: string;
    details: string;
  };
}

const props = defineProps<{
  modelValue: Departure | null;
}>();

defineEmits<{
  (e: 'update:modelValue', departure: Departure | null): void;
}>();

const displayOrigin = computed(() => {
  if (!props.modelValue) return '';
  return getCityFromSlug(props.modelValue.origin) || props.modelValue.origin;
});

const displayDestination = computed(() => {
  if (!props.modelValue) return '';
  return getCityFromSlug(props.modelValue.destination) || props.modelValue.destination;
});
</script>
