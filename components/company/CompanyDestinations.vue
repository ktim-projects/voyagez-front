<template>
  <section v-if="cities.length" class="mt-7">
    <h2 class="text-[19px] lg:text-[22px] font-bold tracking-[-0.025em] mb-1" :style="{ color: 'var(--gy-ink)' }">
      Où va {{ companyName }}
    </h2>
    <p class="text-[13px] mb-3.5" :style="{ color: 'var(--gy-muted)' }">
      {{ cities.map(city => city.name).join(' · ') }}
    </p>

    <ul class="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
      <li
        v-for="tile in tiles"
        :key="tile.slug"
        class="relative flex items-end h-24 lg:h-32 p-3 rounded-[14px] overflow-hidden"
        :style="tile.style"
      >
        <span class="relative text-[15px] font-semibold tracking-[-0.02em]" :style="{ color: tile.ink }">
          {{ tile.name }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { getCityPhoto } from '~/utils/cities';
import type { CompanyCity } from '~/types/company';

const props = defineProps<{
  cities: CompanyCity[];
  companyName: string;
}>();

/**
 * Une ville photographiée porte son visuel assombri pour rester lisible ;
 * les autres retombent sur un aplat de la couleur de la compagnie. Rien
 * n'est inventé : sans fichier, pas d'image.
 */
const tiles = computed(() =>
  props.cities.map((city) => {
    const photo = getCityPhoto(city.slug);

    return {
      slug: city.slug,
      name: city.name,
      ink: photo ? '#ffffff' : 'var(--gy-ink)',
      style: photo
        ? {
            backgroundImage: `linear-gradient(0deg, rgba(10,37,64,.72), rgba(10,37,64,.1)), url('${photo}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid var(--gy-line)'
          }
        : {
            background: 'linear-gradient(150deg, var(--gy-tile-bg), var(--gy-surface))',
            border: '1px solid var(--gy-line)'
          }
    };
  })
);
</script>
