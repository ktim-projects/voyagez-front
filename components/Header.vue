<template>
  <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50" :class="{ 'md:block hidden': isSearchResults }">
    <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-corail-600 hover:text-corail-700 dark:text-corail-500 dark:hover:text-corail-400 transition-colors">
          <img :src="logoPath" alt="Geyavo" class="h-20" />
        </NuxtLink>
      </div>
      
      <div class="hidden md:flex space-x-8 items-center">
        <NuxtLink to="/contact" class="text-gray-700 hover:text-corail-600 dark:text-gray-300 dark:hover:text-corail-500">{{ $t('header.contact') }}</NuxtLink>
      </div>

      <div class="md:hidden flex items-center gap-3">
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
        >
          <Menu v-if="!isMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>
      </div>
    </nav>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-8 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-8 opacity-0"
    >
      <div v-if="isMenuOpen" class="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-md">
        <div class="container mx-auto px-4 py-2 space-y-1">
          <NuxtLink @click="closeMenu" to="/contact" class="block text-gray-700 hover:text-corail-600 dark:text-gray-300 dark:hover:text-corail-500 py-2">{{ $t('header.contact') }}</NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)
const route = useRoute()

const logoPath = computed(() => '/logos/geyavo_full.png')

const isSearchResults = computed(() => route.name === 'results-from-to___fr' || route.path.includes('results/bus') )

const closeMenu = () => {
  isMenuOpen.value = false
}

</script>