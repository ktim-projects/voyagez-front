<template>
  <nav class="bg-gray-50 border-b" aria-label="Fil d'ariane">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol class="flex items-center h-12 space-x-4">
        <li>
          <div>
            <NuxtLink to="/" class="text-gray-400 hover:text-gray-500">
              <HomeIcon class="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span class="sr-only">Accueil</span>
            </NuxtLink>
          </div>
        </li>
        <li v-for="(item, index) in items" :key="index">
          <div class="flex items-center">
            <svg
              class="flex-shrink-0 h-5 w-5 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
            <NuxtLink
              :to="item.href"
              :class="[
                index === items.length - 1
                  ? 'text-gray-700'
                  : 'text-gray-500 hover:text-gray-700',
                'ml-4 text-sm font-medium'
              ]"
              :aria-current="index === items.length - 1 ? 'page' : undefined"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/24/outline'

const route = useRoute()

const items = computed(() => {
  const breadcrumbs = []
  
  if (route.path.includes('/search')) {
    breadcrumbs.push({
      name: 'Recherche',
      href: '/search'
    })

    if (route.query.type === 'bus') {
      breadcrumbs.push({
        name: 'Bus',
        href: `/search?type=bus`
      })
    } else if (route.query.type === 'car') {
      breadcrumbs.push({
        name: 'Cars',
        href: `/search?type=car`
      })
    }
  } else if (route.path.includes('/blog')) {
    breadcrumbs.push({
      name: 'Actualités',
      href: '/blog'
    })
  }
  
  return breadcrumbs
})
</script>