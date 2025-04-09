<template>
  <header class="bg-white shadow-sm sticky top-0 z-50" :class="{ 'md:block hidden': isSearchResults }">
    <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-coral-600 hover:text-coral-700 transition-colors">
          Transport CI
        </NuxtLink>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-8">
        <NuxtLink to="/" class="text-gray-700 hover:text-coral-600">Accueil</NuxtLink>
        <NuxtLink to="/destinations" class="text-gray-700 hover:text-coral-600">Destinations</NuxtLink>
        <NuxtLink to="/about" class="text-gray-700 hover:text-coral-600">À propos</NuxtLink>
        <NuxtLink to="/contact" class="text-gray-700 hover:text-coral-600">Contact</NuxtLink>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden">
        <i class="pi" :class="isMenuOpen ? 'pi-times' : 'pi-bars'" style="font-size: 1.5rem"></i>
      </button>

      <button 
              @click="isMenuOpen = !isMenuOpen" 
              class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu class="h-6 w-6" />
            </button>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-white border-t">
      <div class="container mx-auto px-4 py-4 space-y-4">
        <NuxtLink to="/" class="block text-gray-700 hover:text-red-600 py-2">Accueil</NuxtLink>
        <NuxtLink to="/destinations" class="block text-gray-700 hover:text-red-600 py-2">Destinations</NuxtLink>
        <NuxtLink to="/about" class="block text-gray-700 hover:text-red-600 py-2">À propos</NuxtLink>
        <NuxtLink to="/contact" class="block text-gray-700 hover:text-red-600 py-2">Contact</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const isMenuOpen = ref(false)
const route = useRoute()
const isSearchResults = computed(() => route.name === 'results')
</script>