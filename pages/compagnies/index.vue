<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <header class="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div class="container mx-auto px-4 py-12 md:py-16">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
          Compagnies de car en Côte d'Ivoire
        </h1>
        <p class="mt-3 text-white/80 max-w-2xl">
          Retrouvez les horaires, les trajets et les coordonnées de chaque compagnie
          référencée sur Geyavo.
        </p>
      </div>
    </header>

    <div class="container mx-auto px-4 py-10">
      <ul v-if="companies.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="company in companies" :key="company.id">
          <NuxtLink
            :to="`/compagnies/${company.slug}`"
            class="group flex flex-col h-full p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-corail-400 dark:hover:border-corail-500 hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  v-if="company.logoUrl"
                  :src="company.logoUrl"
                  :alt="`Logo ${company.name}`"
                  class="h-full w-full object-contain p-1"
                >
                <span
                  v-else
                  class="font-bold text-primary-600 dark:text-primary-400"
                  :style="company.brandColor ? { color: company.brandColor } : undefined"
                >
                  {{ getCompanyInitials(company.name) }}
                </span>
              </div>
              <h2 class="font-semibold text-gray-900 dark:text-white group-hover:text-corail-500 transition-colors">
                {{ company.name }}
              </h2>
            </div>

            <p v-if="company.description" class="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {{ company.description }}
            </p>

            <span class="mt-auto pt-4 text-sm font-medium text-corail-500">
              Voir les trajets →
            </span>
          </NuxtLink>
        </li>
      </ul>

      <p v-else class="text-gray-500 dark:text-gray-400">
        Aucune compagnie n'est référencée pour le moment.
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { getCompanyInitials } from '~/utils/companies';
import type { CompanyListResponse } from '~/types/company';

const { secureApiFetch } = useSecureApi();

const { data } = await useAsyncData(
  'companies-list',
  () => secureApiFetch<CompanyListResponse>('/api/car/companies'),
  { default: () => ({ companies: [] }) }
);

const companies = computed(() => data.value?.companies ?? []);

useHead({
  title: 'Compagnies de car en Côte d\'Ivoire | Geyavo',
  meta: [
    {
      name: 'description',
      content: 'Toutes les compagnies de car référencées sur Geyavo : horaires, trajets desservis, gares de départ et coordonnées.'
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Compagnies de car en Côte d\'Ivoire | Geyavo' },
    { property: 'og:url', content: 'https://geyavo.com/compagnies' },
    { property: 'og:site_name', content: 'Geyavo' }
  ],
  link: [
    { rel: 'canonical', href: 'https://geyavo.com/compagnies' }
  ]
});
</script>
