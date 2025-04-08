<template>
  <footer class="bg-white text-gray-600 border-t">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 class="text-gray-900 text-lg font-semibold mb-4">Transport CI</h3>
          <p class="text-gray-600">Votre partenaire de confiance pour voyager en Côte d'Ivoire.</p>
        </div>
        <div>
          <h3 class="text-gray-900 text-lg font-semibold mb-4">Liens Rapides</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="hover:text-red-600">Accueil</NuxtLink></li>
            <li><NuxtLink to="/destinations" class="hover:text-red-600">Destinations</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-red-600">À propos</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-red-600">Contact</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3 class="text-gray-900 text-lg font-semibold mb-4">Contact</h3>
          <ul class="space-y-2">
            <li>Abidjan, Côte d'Ivoire</li>
            <li>contact@transportci.com</li>
            <li>+225 XX XX XX XX</li>
          </ul>
        </div>
        <div>
          <h3 class="text-gray-900 text-lg font-semibold mb-4">Suivez-nous</h3>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-red-600"><i class="pi pi-facebook"></i></a>
            <a href="#" class="hover:text-red-600"><i class="pi pi-twitter"></i></a>
            <a href="#" class="hover:text-red-600"><i class="pi pi-instagram"></i></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>