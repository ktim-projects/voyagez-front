<template>
  <div class="container mx-auto px-4 py-16">
    <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">{{ $t('home.destinations.title') }}</h2>
    
    <!-- Desktop View -->
    <div class="hidden md:grid grid-cols-4 gap-6">
      <div v-for="destination in destinations" :key="destination.name" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
        @click="navigateToSearch(destination.name)">
        <div class="relative h-48">
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="h-full w-full bg-cover bg-center" 
            :style="{ backgroundImage: `url(${destination.image})` }">
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-lg font-semibold text-white">{{ destination.name }}</h3>
            <p class="mt-1 text-white text-sm font-medium">{{ $t('home.destinations.priceFrom') }} {{ destination.price }} FCFA</p>
          </div>
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
        <SwiperSlide v-for="destination in destinations" :key="destination.name" @click="navigateToSearch(destination.name)">
          <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div class="relative h-48">
              <div class="absolute inset-0 bg-black/40"></div>
              <div class="h-full w-full bg-cover bg-center" 
                :style="{ backgroundImage: `url(${destination.image})` }">
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-lg font-semibold text-white">{{ destination.name }}</h3>
                <p class="mt-1 text-white text-sm font-medium">{{ $t('home.destinations.priceFrom') }} {{ destination.price }} FCFA</p>
              </div>
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
import { useRouter } from 'vue-router';
import 'swiper/css';
import 'swiper/css/pagination';

const searchStore = useSearchStore();
const router = useRouter()

const destinations = [
  { 
    name: 'Abidjan',
    price: '5000',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop'
  },
  { 
    name: 'Yamoussoukro',
    price: '7000',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop'
  },
  { 
    name: 'Bouaké',
    price: '8000',
    image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    name: 'San Pedro',
    price: '10000',
    image: 'https://images.pexels.com/photos/1998439/pexels-photo-1998439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const navigateToSearch = async (destination) => {

  searchStore.setSearchParams({
    type: 'car',
    from: null,
    to: destination,
    date: null
  });

  await router.push('/results');
}

</script>

<style scoped>
.swiper {
  padding-bottom: 40px;
}

.swiper-pagination-bullet-active {
  background-color: #dc2626 !important;
}
</style>