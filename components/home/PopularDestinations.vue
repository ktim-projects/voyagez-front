<template>
  <div class="container mx-auto px-4 py-16  popular-destinations-section">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <h2 class="title-poppins text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('home.destinations.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg">{{ $t('home.destinations.subtitle') }}</p>
    </div>
    
    <div class="hidden md:grid grid-cols-4 gap-8">
      <div
        v-for="destination in destinations" 
        :key="destination.name" 
        class="group relative h-80 rounded-2xl overflow-hidden shadow-lg"
      >
        <div 
          class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
          :style="{ backgroundImage: `url(${destination.image})` }"
        ></div>
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        <div class="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:translate-y-0">
          <div class="flex flex-col items-start">
            <h3 class="text-2xl font-bold text-white dark:text-gray-200 mb-2 group-hover:text-corail-300 transition-colors duration-300">
              {{ destination.name }}
            </h3>
            <p class="text-white dark:text-gray-400 text-sm mb-4">{{ destination.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="md:hidden">
      <Swiper
        :slides-per-view="1.2"
        :space-between="16"
        :pagination="{ clickable: true }"
        :modules="[Pagination, EffectCards]"
        :effect="'cards'"
        class="mySwiper"
      >
        <SwiperSlide 
          v-for="destination in destinations" 
          :key="destination.name" 
          class="rounded-xl overflow-hidden shadow-lg"
        >
          <div class="relative h-72">
            <div 
              class="absolute inset-0 bg-cover bg-center" 
              :style="{ backgroundImage: `url(${destination.image})` }"
            ></div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="flex flex-col items-start">
                <h3 class="text-xl font-bold text-white dark:text-gray-200 mb-2">
                  {{ destination.name }}
                </h3>
                <p class="text-white dark:text-gray-400 text-sm mb-4 line-clamp-2">{{ destination.description }}</p>
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
import { Pagination, EffectCards } from 'swiper/modules';
import { useRouter } from 'vue-router';
import { StarIcon, ArrowRightIcon } from 'lucide-vue-next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const searchStore = useSearchStore();
const router = useRouter();

const destinations = [
  { 
    name: 'Abidjan',
    price: '5000',
    rating: 4.8,
    promotion: '-20%',
    description: 'Découvrez la perle de la lagune Ébrié avec ses gratte-ciels et ses marchés animés.',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop'
  },
  { 
    name: 'Yamoussoukro',
    price: '7000',
    rating: 4.5,
    promotion: null,
    description: 'Visitez la capitale politique et sa majestueuse basilique Notre-Dame de la Paix.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'
  },
  { 
    name: 'Bouaké',
    price: '8000',
    rating: 4.2,
    promotion: 'Nouveau',
    description: 'Explorez le cœur économique du centre du pays et sa riche culture.',
    image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    name: 'San Pedro',
    price: '10000',
    rating: 4.6,
    promotion: null,
    description: 'Profitez des plages magnifiques et du port animé de cette ville côtière.',
    image: 'https://images.pexels.com/photos/1998439/pexels-photo-1998439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
  // { 
  //   name: 'Korhogo',
  //   price: '9000',
  //   rating: 4.3,
  //   promotion: null,
  //   description: 'Découvrez la capitale du Nord, célèbre pour son artisanat et sa culture Sénoufo.',
  //   image: 'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  // },
  // { 
  //   name: 'Daloa',
  //   price: '7500',
  //   rating: 4.4,
  //   promotion: null,
  //   description: 'Explorez la capitale de la région du Haut-Sassandra et son marché dynamique.',
  //   image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  // },
  // { 
  //   name: 'Man',
  //   price: '9500',
  //   rating: 4.7,
  //   promotion: '-15%',
  //   description: 'Admirez la ville des 18 montagnes, ses cascades et ses ponts de lianes.',
  //   image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  // },
  // { 
  //   name: 'Grand-Bassam',
  //   price: '6000',
  //   rating: 4.9,
  //   promotion: 'Populaire',
  //   description: 'Plongez dans l\'histoire coloniale et profitez des plages de cette ville classée UNESCO.',
  //   image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  // }
];
</script>

<style scoped>
.swiper {
  padding-bottom: 40px;
  width: 100%;
}

.swiper-pagination-bullet-active {
  background-color: var(--color-corail-500) !important;
}

/* Animation au survol */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.group:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>