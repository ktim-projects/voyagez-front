<template>
  <footer class="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-t dark:border-gray-800">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-4">Geyavo</h3>
          <p class="text-gray-600 dark:text-gray-400">Comparez et trouvez les meilleurs itinéraires de bus et cars en Côte d'Ivoire</p>
        </div>
        <div>
          <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-4">Liens Rapides</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="hover:text-corail-600 dark:hover:text-corail-500">Accueil</NuxtLink></li>
            <li><NuxtLink @click="scrollToDestinations" class="hover:text-corail-600 dark:hover:text-corail-500 cursor-pointer">Destinations</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-corail-600 dark:hover:text-corail-500">Contact</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-4">Légal</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/legal-notice" class="hover:text-corail-600 dark:hover:text-corail-500">Mentions légales</NuxtLink></li>
            <li><NuxtLink to="/privacy-policy" class="hover:text-corail-600 dark:hover:text-corail-500">Politique de confidentialité</NuxtLink></li>
            <li><NuxtLink to="/terms-of-service" class="hover:text-corail-600 dark:hover:text-corail-500">Conditions d'utilisation</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-4">Contact</h3>
          <ul class="space-y-2">
            <li>Abidjan, Côte d'Ivoire</li>
            <li>contact@geyavo.com</li>
            <li>+225 01 42 46 77 13</li>
          </ul>
        </div>
        <div>
          <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-4">Suivez-nous</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Facebook</span>
              <!-- Facebook Icon -->
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <span class="sr-only">Twitter</span>
              <!-- Twitter Icon -->
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Footer légal -->
      <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            © {{ new Date().getFullYear() }} Geyavo. Tous droits réservés.
          </div>
          <div class="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <NuxtLink to="/legal-notice" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Mentions légales
            </NuxtLink>
            <NuxtLink to="/privacy-policy" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Confidentialité
            </NuxtLink>
            <NuxtLink to="/terms-of-service" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              CGU
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">

const scrollToDestinations = () => {
  if (!process.client) return;
  const destinations = document.querySelector('.popular-destinations-section');
  if (destinations) {
    destinations.scrollIntoView({ behavior: 'smooth' });
  }
};

</script>