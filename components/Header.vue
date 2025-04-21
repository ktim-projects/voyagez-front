<template>
  <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50" :class="{ 'md:block hidden': isSearchResults }">
    <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-coral-600 hover:text-coral-700 dark:text-coral-500 dark:hover:text-coral-400 transition-colors">
          {{ $t('header.appName') }}
        </NuxtLink>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-8 items-center">
        <NuxtLink to="/" class="text-gray-700 hover:text-coral-600 dark:text-gray-300 dark:hover:text-coral-500">{{ $t('header.home') }}</NuxtLink>
        <NuxtLink @click.prevent="goToCarResults" class="text-gray-700 hover:text-coral-600 dark:text-gray-300 dark:hover:text-coral-500 cursor-pointer">{{ $t('header.car') }}</NuxtLink>
        <NuxtLink @click.prevent="goToBusResults" class="text-gray-700 hover:text-coral-600 dark:text-gray-300 dark:hover:text-coral-500 cursor-pointer">{{ $t('header.bus') }}</NuxtLink>
        <NuxtLink to="/about" class="text-gray-700 hover:text-coral-600 dark:text-gray-300 dark:hover:text-coral-500">{{ $t('header.about') }}</NuxtLink>
        <NuxtLink to="/contact" class="text-gray-700 hover:text-coral-600 dark:text-gray-300 dark:hover:text-coral-500">{{ $t('header.contact') }}</NuxtLink>
        <!-- <LanguageSwitcher /> -->
        <ThemeSwitch />
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden flex items-center gap-3">
        <!-- <LanguageSwitcher /> -->
        <ThemeSwitch />
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
        >
          <Menu v-if="!isMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
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
          <NuxtLink @click="closeMenu" to="/" class="block text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-coral-500 py-2">{{ $t('header.home') }}</NuxtLink>
          <span @click="goToCarResultsAndCloseMenu" class="block text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-coral-500 py-2 cursor-pointer">{{ $t('header.car') }}</span>
          <span @click="goToBusResultsAndCloseMenu" class="block text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-coral-500 py-2 cursor-pointer">{{ $t('header.bus') }}</span>
          <NuxtLink @click="closeMenu" to="/about" class="block text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-coral-500 py-2">{{ $t('header.about') }}</NuxtLink>
          <NuxtLink @click="closeMenu" to="/contact" class="block text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-coral-500 py-2">{{ $t('header.contact') }}</NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { Menu, X } from 'lucide-vue-next'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'

const searchStore = useSearchStore();

const isMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()


const isSearchResults = computed(() => route.path === '/results')

// Fonction pour fermer le menu mobile
const closeMenu = () => {
  isMenuOpen.value = false
}

const goToBusResultsAndCloseMenu = async () => {
  await goToBusResults()
  closeMenu()
}

const goToCarResultsAndCloseMenu = async () => {
  await goToCarResults()
  closeMenu()
}

const goToBusResults = async () => {

  searchStore.setSearchParams({
    type: 'bus',
    from: '',
    to: '',
    date: null
  });

  await router.push('/results');
}

const goToCarResults = async () => {
  searchStore.setSearchParams({
    type: 'car',
    from: '',
    to: '',
    date: null
  });

  await router.push('/results');
}
</script>