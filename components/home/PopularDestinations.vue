<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Destinations Populaires</h2>
    
    <!-- Desktop View -->
    <div class="hidden md:grid grid-cols-4 gap-6">
      <div v-for="destination in destinations" :key="destination.name" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div class="h-48 w-full bg-cover bg-center" 
          :style="{ backgroundImage: `url(${destination.image})` }">
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ destination.name }}</h3>
          <p class="mt-1 text-[#1e3a8a] text-sm font-medium">À partir de {{ destination.price }} FCFA</p>
        </div>
      </div>
    </div>

    <!-- Mobile View with Swiper -->
    <div class="md:hidden">
      <Swiper
        :slides-per-view="1.2"
        :space-between="16"
        :pagination="{ clickable: true }"
        :modules="[Pagination]"
        class="mySwiper"
      >
        <SwiperSlide v-for="destination in destinations" :key="destination.name">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="h-48 w-full bg-cover bg-center" 
              :style="{ backgroundImage: `url(${destination.image})` }">
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ destination.name }}</h3>
              <p class="mt-1 text-red-600 font-medium">À partir de {{ destination.price }} FCFA</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const destinations = [
  { 
    name: 'Abidjan',
    price: '5000',
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    name: 'Yamoussoukro',
    price: '7000',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop'
  },
  { 
    name: 'Bouaké',
    price: '8000',
    image: 'https://images.unsplash.com/photo-1504598318550-17eba0c5f5ad?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    name: 'San Pedro',
    price: '10000',
    image: 'https://images.unsplash.com/photo-1504542982118-59308b40fe0c?q=80&w=2070&auto=format&fit=crop'
  }
];
</script>

<style scoped>
.swiper {
  padding-bottom: 40px;
}

.swiper-pagination-bullet-active {
  background-color: #dc2626 !important;
}
</style>