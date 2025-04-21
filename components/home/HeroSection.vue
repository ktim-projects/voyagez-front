<template>
  <div class="relative h-[600px] sm:h-[600px] overflow-hidden">
    <!-- Image de fond avec effet parallaxe -->
    <div 
      class="absolute inset-0 bg-cover bg-center transform scale-110 transition-transform duration-1000"
      :style="{
        backgroundImage: `url('${currentImage}')`,
        transform: `translateY(${scrollY * 0.2}px) scale(1.1)`
      }"
    ></div>
    
    <!-- Overlay avec dégradé -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
    
    <!-- Contenu -->
    <div class="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center text-center">
      <div 
        class="max-w-3xl mx-auto transform transition-all duration-700"
        :style="{ transform: `translateY(${Math.min(0, -scrollY * 0.1)}px)` }"
      >
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight text-white mb-2">
          <span class="block text-coral-500">{{ $t('home.hero.titleHighlight') }}</span>
          <span>{{ $t('home.hero.title') }}</span>
        </h1>
        <p class="mt-6 text-xl leading-8 text-gray-200 max-w-2xl mx-auto">
          {{ $t('home.hero.subtitle') }}
        </p>
        
        <!-- Boutons d'action -->
        <div class="mt-10 mb-16 sm:mb-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            class="px-8 py-3 bg-coral-500 text-white rounded-full font-medium hover:bg-coral-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-coral-500/30"
            @click="scrollToSearch"
          >
            {{ $t('home.hero.primaryButton') }}
          </button>
          <button 
            class="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium border border-white/30 hover:bg-white/20 transition-all duration-300"
            @click="scrollToDestinations"
          >
            {{ $t('home.hero.secondaryButton') }}
          </button>
        </div>
      </div>
      
      <!-- Indicateur de défilement -->
      <div 
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        @click="scrollToSearch"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Images de fond pour le carrousel
const backgroundImages = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop',
  'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
];

const currentImage = ref(backgroundImages[0]);
const currentIndex = ref(0);
const scrollY = ref(0);

// Fonction pour faire défiler jusqu'au formulaire de recherche
const scrollToSearch = () => {
  const searchForm = document.querySelector('.search-form-section');
  if (searchForm) {
    searchForm.scrollIntoView({ behavior: 'smooth' });
  }
};

// Fonction pour faire défiler jusqu'aux destinations populaires
const scrollToDestinations = () => {
  const destinations = document.querySelector('.popular-destinations-section');
  if (destinations) {
    destinations.scrollIntoView({ behavior: 'smooth' });
  }
};

// Effet de parallaxe au défilement
const handleScroll = () => {
  scrollY.value = window.scrollY;
};

// Rotation des images de fond
const rotateBackgroundImage = () => {
  currentIndex.value = (currentIndex.value + 1) % backgroundImages.length;
  currentImage.value = backgroundImages[currentIndex.value];
};

let imageInterval: number;

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Changer d'image toutes les 5 secondes
  imageInterval = window.setInterval(rotateBackgroundImage, 5000);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  clearInterval(imageInterval);
});
</script>

<style scoped>
/* Animation de fondu pour les transitions d'images */
.bg-cover {
  transition: background-image 1.5s ease-in-out;
}
</style>