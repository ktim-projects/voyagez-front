<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Titre et sous-titre -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('home.howItWorks.title') }}</h2>
        <p class="text-gray-600 text-lg">{{ $t('home.howItWorks.subtitle') }}</p>
      </div>
      
      <!-- Étapes -->
      <div class="relative">
        <!-- Ligne de connexion -->
        <div class="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-corail-500 to-primary-500 transform -translate-y-1/2 z-0"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="flex flex-col items-center text-center"
          >
            <!-- Numéro d'étape avec animation -->
            <div 
              class="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-xl border-4 border-gray-100 relative transform transition-all duration-500 hover:scale-110 hover:border-corail-500"
            >
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-corail-500 flex items-center justify-center text-white text-2xl font-bold">
                {{ index + 1 }}
              </div>
              
              <!-- Icône -->
              <div class="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-corail-500 flex items-center justify-center shadow-md">
                <component :is="step.icon" class="h-4 w-4 text-white" />
              </div>
            </div>
            
            <!-- Titre et description -->
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t(step.titleKey) }}</h3>
            <p class="text-gray-600">{{ $t(step.descriptionKey) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Vidéo explicative ou image illustrative -->
      <div class="mt-16 rounded-2xl overflow-hidden shadow-xl">
        <div class="relative pb-[56.25%] h-0">
          <img 
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop" 
            alt="Comment ça marche" 
            class="absolute inset-0 w-full h-full object-cover"
            onerror="this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop'; this.onerror=null;"
          />
          
          <!-- Bouton de lecture vidéo -->
          <div class="absolute inset-0 flex items-center justify-center dark:text-white">
            <button 
              class="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110"
              @click="playVideo"
            >
              <div class="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-corail-500 border-b-[8px] border-b-transparent ml-1"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { SearchIcon, MapPinIcon, CarIcon, UserCheckIcon } from 'lucide-vue-next';

const steps = [
  {
    titleKey: 'home.howItWorks.step1.title',
    descriptionKey: 'home.howItWorks.step1.description',
    icon: SearchIcon
  },
  {
    titleKey: 'home.howItWorks.step2.title',
    descriptionKey: 'home.howItWorks.step2.description',
    icon: MapPinIcon
  },
  {
    titleKey: 'home.howItWorks.step3.title',
    descriptionKey: 'home.howItWorks.step3.description',
    icon: CarIcon
  },
  {
    titleKey: 'home.howItWorks.step4.title',
    descriptionKey: 'home.howItWorks.step4.description',
    icon: UserCheckIcon
  }
];

// Fonction pour lire la vidéo (à implémenter avec une modal)
const playVideo = () => {
  // Implémenter l'ouverture d'une modal avec la vidéo
  alert('Vidéo explicative à venir !');
};
</script>

<style scoped>
/* Animation pour les étapes */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(250, 107, 107, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(250, 107, 107, 0); }
  100% { box-shadow: 0 0 0 0 rgba(250, 107, 107, 0); }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style>
