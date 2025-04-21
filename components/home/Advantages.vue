<template>
  <section class="pt-24 pb-16 dark:bg-gray-900 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Titre et sous-titre -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('home.advantages.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg">{{ $t('home.advantages.subtitle') }}</p>
      </div>
      
      <!-- Avantages -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(advantage, index) in advantages" 
          :key="index" 
          class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
        >
          <!-- Icône avec animation -->
          <div class="mb-6 relative">
            <div class="w-16 h-16 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <!-- <component :is="advantage.icon" class="h-8 w-8 text-white" /> -->
              <AppIcon :name="advantage.icon" class="h-8 w-8 text-white" />
            </div>
          </div>
          
          <!-- Titre et description -->
          <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-300 mb-3">{{ $t(advantage.titleKey) }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ $t(advantage.descriptionKey) }}</p>
          
          <!-- Liste de points forts -->
          <ul class="space-y-2 mt-4">
            <li v-for="(point, i) in advantage.points" :key="i" class="flex items-start">
              <CheckIcon class="h-5 w-5 text-coral-500 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-gray-700 dark:text-gray-300 text-sm">{{ $t(point) }}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Bannière d'appel à l'action -->
      <div class="mt-16 bg-primary-600 dark:bg-primary-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500 dark:bg-primary-600 rounded-full opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-primary-700 dark:bg-primary-800 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div class="mb-6 md:mb-0 md:mr-8">
            <h3 class="text-2xl font-bold mb-2">{{ $t('home.advantages.cta.title') }}</h3>
            <p class="text-primary-100">{{ $t('home.advantages.cta.description') }}</p>
          </div>
          <button 
            class="px-6 py-3 bg-white dark:bg-gray-700 text-primary-600 rounded-full font-medium hover:bg-primary-50 dark:hover:bg-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            @click="scrollToSearch"
          >
            {{ $t('home.advantages.cta.button') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next';

const advantages = [
  {
    titleKey: 'home.advantages.timeGain.title',
    descriptionKey: 'home.advantages.timeGain.description',
    icon: 'Clock',
    points: [
      'home.advantages.timeGain.point1',
      'home.advantages.timeGain.point2',
      'home.advantages.timeGain.point3'
    ]
  },
  {
    titleKey: 'home.advantages.bestPrices.title',
    descriptionKey: 'home.advantages.bestPrices.description',
    icon: 'Wallet',
    points: [
      'home.advantages.bestPrices.point1',
      'home.advantages.bestPrices.point2',
      'home.advantages.bestPrices.point3'
    ]
  },
  {
    titleKey: 'home.advantages.reliability.title',
    descriptionKey: 'home.advantages.reliability.description',
    icon: 'ShieldCheck',
    points: [
      'home.advantages.reliability.point1',
      'home.advantages.reliability.point2',
      'home.advantages.reliability.point3'
    ]
  },
];

// Fonction pour faire défiler jusqu'au formulaire de recherche
const scrollToSearch = () => {
  const searchForm = document.querySelector('.search-form-section');
  if (searchForm) {
    searchForm.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
/* Animation subtile au survol */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

.hover\:animate-float:hover {
  animation: float 2s ease-in-out infinite;
}
</style>
