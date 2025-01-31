<template>
  <footer class="bg-gray-800 text-white mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">VoyagezCi</h3>
          <p class="text-gray-400">Trouvez et comparez les meilleures options de transport pour votre voyage.</p>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4">Liens Rapides</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="text-gray-400 hover:text-white">Accueil</NuxtLink></li>
            <li><NuxtLink to="/search" class="text-gray-400 hover:text-white">Comparer</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-400 hover:text-white">À Propos</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white">Contact</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4">Mentions Légales</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/privacy-policy" class="text-gray-400 hover:text-white">Politique de Confidentialité</NuxtLink></li>
            <li><NuxtLink to="/terms-of-service" class="text-gray-400 hover:text-white">Conditions d'Utilisation</NuxtLink></li>
            <li><NuxtLink to="/cookie-policy" class="text-gray-400 hover:text-white">Politique des Cookies</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4">Suivez-nous</h4>
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
      
      <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} VoyagezCi. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>