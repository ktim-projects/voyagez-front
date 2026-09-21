<template>
  <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4">
      <dl class="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6">
        <div
          v-for="item in items"
          :key="item.label"
          class="pl-4 border-l-2 border-corail-500"
        >
          <dd class="text-2xl font-bold text-gray-900 dark:text-white">{{ item.value }}</dd>
          <dt class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ item.label }}</dt>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CompanyPageStats } from '~/types/company';

const props = defineProps<{
  stats: CompanyPageStats;
}>();

/**
 * Seuls les chiffres réellement calculés depuis les départs sont affichés :
 * une entrée sans donnée est retirée plutôt que remplie d'un zéro trompeur.
 */
const items = computed(() => {
  const list: Array<{ label: string; value: string }> = [
    {
      label: props.stats.cities > 1 ? 'villes desservies' : 'ville desservie',
      value: String(props.stats.cities)
    },
    {
      label: props.stats.routes > 1 ? 'trajets proposés' : 'trajet proposé',
      value: String(props.stats.routes)
    },
    {
      label: props.stats.departures > 1 ? 'départs référencés' : 'départ référencé',
      value: String(props.stats.departures)
    }
  ].filter(item => item.value !== '0');

  if (props.stats.minPrice !== null) {
    list.push({
      label: 'à partir de',
      value: `${props.stats.minPrice.toLocaleString('fr-FR')} F`
    });
  }

  return list;
});
</script>
