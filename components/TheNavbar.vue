<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-4">
          <!-- Mobile menu button -->
          <div class="flex items-center sm:hidden">
            <button 
              @click="isOpen = true"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu class="h-6 w-6" />
            </button>
          </div>

          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
              VoyagezCi
            </NuxtLink>
          </div>
          
          <!-- Liens de Navigation Desktop -->
          <div class="hidden sm:flex sm:items-center sm:space-x-8">
            <NuxtLink to="/"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="route.path === '/' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'"
            >
              Accueil
            </NuxtLink>
            <!-- <NuxtLink to="/search"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="route.path.includes('/search') ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'"
            >
              Rechercher
            </NuxtLink> -->
            <NuxtLink to="/blog"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="route.path.includes('/blog') ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'"
            >
              Actualités
            </NuxtLink>
            <NuxtLink to="/contact"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="route.path === '/contact' ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'"
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

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-opacity ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black bg-opacity-25 z-40"
        @click="isOpen = false"
      >
        <Transition
          enter-active-class="transform transition ease-out duration-300"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transform transition ease-in duration-200"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
        >
          <div 
            v-if="isOpen"
            class="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 overflow-y-auto"
            @click.stop
          >
            <!-- Menu mobile header -->
            <div class="px-4 py-6 border-b border-gray-200 flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Menu</h2>
              <button 
                @click="isOpen = false"
                class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              >
                <X class="h-6 w-6" />
              </button>
            </div>

            <!-- Menu mobile items -->
            <div class="px-2 py-3">
              <NuxtLink
                v-for="item in menuItems"
                :key="item.name"
                :to="item.href"
                class="flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors"
                :class="route.path === item.href ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'"
                @click="isOpen = false"
              >
                <component :is="item.icon" class="h-5 w-5 mr-3" />
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Home,
  Search,
  Newspaper,
  Mail,
  User,
  Menu,
  X
} from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const route = useRoute();
const isOpen = ref(false);

// Menu items
const menuItems = [
  {
    name: 'Accueil',
    href: '/',
    icon: Home,
  },
  // {
  //   name: 'Rechercher',
  //   href: '/search',
  //   icon: Search,
  // },
  {
    name: 'Actualités',
    href: '/blog',
    icon: Newspaper,
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: Mail,
  },
  // {
  //   name: 'Se connecter',
  //   href: '/login',
  //   icon: User,
  // },
];
</script>