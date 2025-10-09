<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-corail-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
    <div class="max-w-4xl w-full">
      <div class="text-center">
        <!-- Image 404 -->
        <div class="mb-8 flex justify-center">
          <img 
            src="/images/404.svg" 
            alt="404 - Page non trouvée" 
            class="w-full max-w-2xl h-auto"
          />
        </div>

        <!-- Titre -->
        <h1 class="text-6xl md:text-8xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          404
        </h1>
        
        <!-- Message -->
        <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Oups ! Cette page n'existe pas
        </h2>
        
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Il semblerait que cette page ait pris un autre trajet. 
          Ne vous inquiétez pas, nous allons vous ramener sur la bonne route !
        </p>

        <!-- Boutons d'action -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink 
            to="/"
            class="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <HomeIcon class="w-5 h-5" />
            Retour à l'accueil
          </NuxtLink>
        </div>

        <!-- Suggestions -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Vous cherchez peut-être :
          </p>
          <div class="flex flex-wrap gap-3 justify-center">
            <NuxtLink 
              to="/results/abidjan/bouake"
              class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              🚌 Trajet Abidjan - Bouaké
            </NuxtLink>
            <NuxtLink 
              to="/results/abidjan/yamoussoukro"
              class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              🚌 Trajets Abidjan - Yamoussoukro
            </NuxtLink>
            <NuxtLink 
              to="/contact"
              class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              📞 Contact
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, ArrowLeftIcon } from 'lucide-vue-next';

const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
});

const router = useRouter();

const goBack = () => {
  // Vérifier s'il y a un historique
  if (window.history.length > 1) {
    router.back();
  } else {
    // Sinon, rediriger vers l'accueil
    router.push('/');
  }
};

// SEO
useHead({
  title: '404 - Page non trouvée | Geyavo',
  meta: [
    {
      name: 'description',
      content: 'La page que vous recherchez n\'existe pas. Retournez à l\'accueil pour trouver votre trajet en car ou en bus en Côte d\'Ivoire.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    }
  ]
});
</script>

<style scoped>
/* Animation subtile pour l'image */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

img {
  animation: float 3s ease-in-out infinite;
}
</style>
