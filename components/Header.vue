<template>
  <header class="bg-white shadow-sm sticky top-0 z-50" :class="{ 'md:block hidden': isSearchResults }">
    <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-coral-600 hover:text-coral-700 transition-colors">
          {{ $t('header.appName') }}
        </NuxtLink>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-8 items-center">
        <NuxtLink to="/" class="text-gray-700 hover:text-coral-600">{{ $t('header.home') }}</NuxtLink>
        <NuxtLink @click.prevent="goToCarResults" class="text-gray-700 hover:text-coral-600 cursor-pointer">{{ $t('header.car') }}</NuxtLink>
        <NuxtLink @click.prevent="goToBusResults" class="text-gray-700 hover:text-coral-600 cursor-pointer">{{ $t('header.bus') }}</NuxtLink>
        <NuxtLink to="/about" class="text-gray-700 hover:text-coral-600">{{ $t('header.about') }}</NuxtLink>
        <NuxtLink to="/contact" class="text-gray-700 hover:text-coral-600">{{ $t('header.contact') }}</NuxtLink>
        <!-- <LanguageSwitcher /> -->
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden flex items-center gap-3">
        <!-- <LanguageSwitcher /> -->
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t shadow-md">
        <div class="container mx-auto px-4 py-2 space-y-1">
          <NuxtLink to="/" class="block text-gray-700 hover:text-red-600 py-2">{{ $t('header.home') }}</NuxtLink>
          <span @click="goToCarResults" class="block text-gray-700 hover:text-red-600 py-2 cursor-pointer">{{ $t('header.car') }}</span>
          <span @click="goToBusResults" class="block text-gray-700 hover:text-red-600 py-2 cursor-pointer">{{ $t('header.bus') }}</span>
          <NuxtLink to="/about" class="block text-gray-700 hover:text-red-600 py-2">{{ $t('header.about') }}</NuxtLink>
          <NuxtLink to="/contact" class="block text-gray-700 hover:text-red-600 py-2">{{ $t('header.contact') }}</NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { Menu, X } from 'lucide-vue-next'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const searchStore = useSearchStore();

const isMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()


const isSearchResults = computed(() => route.name === 'results')

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