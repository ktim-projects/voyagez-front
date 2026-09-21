<template>
  <section>
    <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Trajets desservis
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Horaires, prix et gares de {{ companyName }}
        </p>
      </div>

      <div v-if="hasMore" class="text-sm text-gray-500 dark:text-gray-400">
        {{ routes.length }} trajets au total
      </div>
    </div>

    <ul v-if="routes.length" class="grid gap-3 sm:grid-cols-2">
      <li v-for="route in visibleRoutes" :key="`${route.fromSlug}-${route.toSlug}`">
        <NuxtLink
          :to="routeLink(route)"
          class="group flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-corail-400 dark:hover:border-corail-500 hover:shadow-md transition-all duration-200"
        >
          <div class="min-w-0">
            <div class="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <span class="truncate">{{ route.from }}</span>
              <ArrowRight class="w-4 h-4 text-corail-500 shrink-0" />
              <span class="truncate">{{ route.to }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ route.departures }} {{ route.departures > 1 ? 'départs référencés' : 'départ référencé' }}
            </p>
          </div>

          <div class="text-right shrink-0">
            <p v-if="route.minPrice !== null" class="font-bold text-primary-600 dark:text-primary-400">
              {{ route.minPrice.toLocaleString('fr-FR') }}
              <span class="text-xs font-normal">FCFA</span>
            </p>
            <span class="text-xs text-gray-400 group-hover:text-corail-500 transition-colors">
              Voir les horaires
            </span>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="text-gray-500 dark:text-gray-400">
      Aucun trajet n'est encore référencé pour cette compagnie.
    </p>

    <div v-if="hasMore" class="mt-6 text-center">
      <button
        type="button"
        class="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        @click="showAll = true"
      >
        Voir les {{ routes.length - visibleRoutes.length }} autres trajets
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import type { CompanyRoute } from '~/types/company';

const props = defineProps<{
  routes: CompanyRoute[];
  companyName: string;
  companySlug: string;
}>();

const INITIAL_COUNT = 8;

const showAll = ref(false);

const visibleRoutes = computed(() =>
  showAll.value ? props.routes : props.routes.slice(0, INITIAL_COUNT)
);

const hasMore = computed(() => !showAll.value && props.routes.length > INITIAL_COUNT);

/**
 * Le paramètre `compagnie` pré-sélectionne le filtre sur la page de
 * résultats : l'utilisateur arrive sur les départs de cette compagnie
 * uniquement, ce qui est tout l'intérêt de la page.
 */
const routeLink = (route: CompanyRoute) => ({
  path: `/results/${route.fromSlug}/${route.toSlug}`,
  query: { compagnie: props.companySlug }
});
</script>
