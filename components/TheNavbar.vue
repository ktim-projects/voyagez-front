<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
              VoyagezCi
            </NuxtLink>
          </div>
          
          <!-- Liens de Navigation -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink to="/"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="route.path === '/' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'"
            >
              Accueil
            </NuxtLink>
            <NuxtLink to="/search"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="route.path.includes('/search') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'"
            >
              Rechercher
            </NuxtLink>
            <NuxtLink to="/blog"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="route.path.includes('/blog') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'"
            >
              Actualités
            </NuxtLink>
            <NuxtLink to="/contact"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium"
              :class="route.path === '/contact' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'"
            >
              Contact
            </NuxtLink>
          </div>
        </div>

        <!-- Boutons de droite -->
        <div class="flex items-center">
          <button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Se connecter
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
</script>