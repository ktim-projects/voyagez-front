<template>
  <div class="grid gap-6 lg:grid-cols-2 items-start">
    <!-- Villes desservies -->
    <section v-if="cities.length" class="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
        <MapPin class="w-5 h-5 text-corail-500" />
        Villes desservies
      </h2>
      <ul class="flex flex-wrap gap-2">
        <li v-for="city in cities" :key="city.slug">
          <span class="inline-block px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {{ city.name }}
          </span>
        </li>
      </ul>
    </section>

    <!-- Gares de départ -->
    <section v-if="stations.length" class="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
        <Building2 class="w-5 h-5 text-corail-500" />
        Gares de départ
      </h2>
      <ul class="space-y-2">
        <li
          v-for="station in stations"
          :key="station"
          class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          <MapPin class="w-4 h-4 text-gray-400 shrink-0" />
          {{ station }}
        </li>
      </ul>
    </section>

    <!-- Catégories de confort réellement proposées -->
    <section v-if="comfortCategories.length" class="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
        <Armchair class="w-5 h-5 text-corail-500" />
        Catégories proposées
      </h2>
      <ul class="flex flex-wrap gap-2">
        <li v-for="category in comfortCategories" :key="category">
          <span
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
            :class="getComfortChipClasses(category)"
          >
            {{ category }}
          </span>
        </li>
      </ul>
    </section>

    <!-- Services déclarés par la compagnie -->
    <section v-if="services.length" class="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <h2 class="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
        <Sparkles class="w-5 h-5 text-corail-500" />
        Services
      </h2>
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <li
          v-for="service in services"
          :key="service"
          class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
        >
          <Check class="w-4 h-4 text-corail-500 shrink-0" />
          {{ service }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Building2, Armchair, Sparkles, Check } from 'lucide-vue-next';
import { getComfortChipClasses } from '~/utils/comfort';
import type { CompanyCity } from '~/types/company';

defineProps<{
  cities: CompanyCity[];
  stations: string[];
  comfortCategories: string[];
  services: string[];
}>();
</script>
