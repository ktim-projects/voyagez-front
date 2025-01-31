<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Destinations populaires</h2>
        <p class="text-gray-600">Découvrez les destinations les plus prisées par nos voyageurs</p>
      </div>

      <!-- Version Desktop -->
      <div class="hidden md:grid md:grid-cols-3 gap-8">
        <div 
          v-for="destination in destinations.slice(0, 3)" 
          :key="destination.name"
          @click="$emit('select', destination.name)"
          class="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
        >
          <img 
            :src="destination.image" 
            :alt="destination.name"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 brightness-90 contrast-95 saturate-75"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-50 mix-blend-multiply"></div>
          <div class="absolute bottom-0 left-0 right-0 p-8">
            <h3 class="text-2xl font-bold text-white mb-2">{{ destination.name }}</h3>
            <p class="text-white/90">{{ destination.description }}</p>
          </div>
        </div>
      </div>

      <!-- Version Mobile avec Swiper -->
      <div class="md:hidden">
        <swiper
          :modules="swiperModules"
          :slides-per-view="1.2"
          :space-between="16"
          :pagination="{ clickable: true }"
          class="w-full"
        >
          <swiper-slide 
            v-for="destination in destinations.slice(0, 6)" 
            :key="destination.name"
            class="pb-12"
          >
            <div 
              @click="$emit('select', destination.name)"
              class="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                :src="destination.image" 
                :alt="destination.name"
                class="absolute inset-0 w-full h-full object-cover brightness-90 contrast-95 saturate-75"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 mix-blend-multiply"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <h3 class="text-xl font-bold text-white mb-2">{{ destination.name }}</h3>
                <p class="text-sm text-white/90">{{ destination.description }}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const swiperModules = [Pagination]

defineProps<{
  destinations: Array<{
    name: string
    description: string
    image: string
  }>
}>()

defineEmits<{
  (e: 'select', destination: string): void
}>()
</script>

<style scoped>
:deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.5;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}
</style>
