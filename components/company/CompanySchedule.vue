<template>
  <section>
    <div class="flex items-baseline justify-between gap-3 mb-1">
      <h2 class="text-[19px] lg:text-[22px] font-bold tracking-[-0.025em]" :style="{ color: 'var(--gy-ink)' }">
        Lignes et horaires
      </h2>
      <span class="text-xs font-medium shrink-0" :style="{ color: 'var(--gy-muted)' }">
        {{ stats.departures }} {{ stats.departures > 1 ? 'départs' : 'départ' }}
      </span>
    </div>
    <p class="text-[13px] mb-4" :style="{ color: 'var(--gy-muted)' }">
      Horaires communiqués par la compagnie. Dépliez une ligne pour voir tous les départs.
    </p>

    <!-- Les filtres n'ont lieu qu'après interaction : le HTML servi contient
         déjà toutes les lignes, le SEO n'en dépend pas (cf. CLAUDE.md). -->
    <div
      v-if="showSearch"
      class="sticky top-0 z-10 mb-3.5 pt-3 pb-2.5"
      :style="{ background: 'var(--gy-page-bg)' }"
    >
      <div
        class="flex items-center gap-2.5 px-3 h-[46px] rounded-xl"
        :style="{ background: 'var(--gy-surface)', border: '1px solid var(--gy-line)' }"
      >
        <Search class="w-[17px] h-[17px] shrink-0" :style="{ color: 'var(--gy-muted)' }" />
        <input
          v-model="query"
          type="search"
          placeholder="Ville de départ, destination, gare…"
          aria-label="Filtrer les lignes"
          class="flex-1 min-w-0 bg-transparent border-0 outline-none text-[15px] placeholder:font-normal"
          :style="{ color: 'var(--gy-ink)' }"
        >
      </div>

      <div class="flex gap-1.5 mt-2.5 overflow-x-auto pb-0.5">
        <button
          v-for="option in cityOptions"
          :key="option"
          type="button"
          class="shrink-0 px-3.5 py-1.5 min-h-[34px] rounded-full text-[13px] font-medium whitespace-nowrap transition-colors"
          :style="chipStyle(city === option)"
          @click="city = option"
        >
          {{ option }}
        </button>
      </div>

      <div class="flex items-center gap-1.5 mt-2 flex-wrap">
        <button
          v-for="option in MOMENT_OPTIONS"
          :key="option"
          type="button"
          class="shrink-0 px-3 py-1.5 min-h-[32px] rounded-[9px] text-xs font-medium transition-colors"
          :style="chipStyle(moment === option)"
          @click="moment = option"
        >
          {{ option }}
        </button>
        <span class="ml-auto text-xs font-medium" :style="{ color: 'var(--gy-muted)' }">
          {{ resultLine }}
        </span>
      </div>
    </div>

    <div v-if="visibleRoutes.length" class="flex flex-col gap-3">
      <article
        v-for="entry in visibleRoutes"
        :key="entry.key"
        class="flex overflow-hidden rounded-2xl"
        :style="{ background: 'var(--gy-surface)', border: '1px solid var(--gy-line)' }"
      >
        <div class="w-1 shrink-0" :style="{ background: 'var(--gy-brand)' }" />

        <div class="flex-1 min-w-0">
          <div class="px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="flex items-center gap-2 text-base font-semibold tracking-[-0.02em]" :style="{ color: 'var(--gy-ink)' }">
                  <span class="truncate">{{ entry.route.from }}</span>
                  <ArrowRight class="w-4 h-4 shrink-0 opacity-45" />
                  <span class="truncate">{{ entry.route.to }}</span>
                </h3>
                <p class="mt-1.5 text-xs" :style="{ color: 'var(--gy-muted)' }">{{ entry.meta }}</p>
              </div>

              <div v-if="entry.price" class="text-right shrink-0">
                <p class="text-base font-bold tabular-nums tracking-[-0.02em]" :style="{ color: 'var(--gy-brand-ink)' }">
                  {{ entry.price }}
                </p>
                <p class="text-[11px]" :style="{ color: 'var(--gy-muted)' }">à partir de</p>
              </div>
            </div>

            <ul v-if="entry.route.comfortCategories.length" class="flex flex-wrap gap-1.5 mt-3">
              <li
                v-for="category in entry.route.comfortCategories"
                :key="category"
                class="text-[11px] font-medium px-2.5 py-1 rounded-full"
                :style="{ background: 'var(--gy-chip-bg)', color: 'var(--gy-chip-ink)' }"
              >
                {{ category }}
              </li>
            </ul>
          </div>

          <button
            type="button"
            class="w-full flex items-center justify-between gap-2 px-4 py-2.5 min-h-[44px] text-[13px] font-semibold text-left transition-colors"
            :style="{
              background: entry.open ? 'var(--gy-chip-bg)' : 'transparent',
              borderTop: '1px dashed var(--gy-line)',
              color: 'var(--gy-brand-ink)'
            }"
            :aria-expanded="entry.open"
            :aria-controls="`horaires-${entry.key}`"
            @click="toggle(entry.key)"
          >
            <span>{{ entry.toggleLabel }}</span>
            <ChevronDown class="w-4 h-4 transition-transform" :class="entry.open ? 'rotate-180' : ''" />
          </button>

          <div v-if="entry.open" :id="`horaires-${entry.key}`" :style="{ borderTop: '1px solid var(--gy-line)' }">
            <div
              v-for="(slot, index) in entry.visible"
              :key="`${slot.departureTime}-${index}`"
              class="flex items-center gap-3 px-4 py-3"
              :style="{ borderBottom: '1px dashed var(--gy-line)' }"
            >
              <div class="shrink-0 w-[66px] lg:w-[84px]">
                <p class="text-[15px] font-bold tabular-nums tracking-[-0.02em]" :style="{ color: 'var(--gy-ink)' }">
                  {{ slot.departureTime }}
                </p>
                <p v-if="slot.arrivalTime" class="text-[11px] tabular-nums" :style="{ color: 'var(--gy-muted)' }">
                  arr. {{ slot.arrivalTime }}
                </p>
              </div>

              <div class="flex-1 min-w-0">
                <p v-if="slot.station" class="text-xs font-medium truncate" :style="{ color: 'var(--gy-ink)' }">
                  {{ slot.station }}
                </p>
                <p v-if="describeSlot(slot)" class="text-[11px] truncate" :style="{ color: 'var(--gy-muted)' }">
                  {{ describeSlot(slot) }}
                </p>
              </div>

              <span
                v-if="formatCompanyPrice(slot.price)"
                class="text-sm font-semibold tabular-nums shrink-0"
                :style="{ color: 'var(--gy-ink)' }"
              >
                {{ formatCompanyPrice(slot.price) }}
              </span>
            </div>

            <button
              v-if="entry.hasMore"
              type="button"
              class="w-full px-4 py-2.5 min-h-[44px] text-[13px] font-semibold"
              :style="{ color: 'var(--gy-brand-ink)' }"
              @click="expanded.add(entry.key)"
            >
              {{ entry.moreLabel }}
            </button>
          </div>
        </div>
      </article>
    </div>

    <div
      v-else
      class="rounded-2xl px-5 py-7 text-center"
      :style="{ border: '1px dashed var(--gy-line)' }"
    >
      <p class="text-sm font-semibold" :style="{ color: 'var(--gy-ink)' }">Aucune ligne ne correspond</p>
      <p class="mt-1.5 mb-3.5 text-[13px]" :style="{ color: 'var(--gy-muted)' }">
        Essayez une autre ville ou un autre moment de la journée.
      </p>
      <button
        type="button"
        class="px-4 py-2.5 min-h-[40px] rounded-[11px] text-[13px] font-semibold"
        :style="{ background: 'var(--gy-brand-soft)', color: 'var(--gy-brand-ink)' }"
        @click="resetFilters"
      >
        Réinitialiser les filtres
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, ChevronDown, Search } from 'lucide-vue-next';
import { formatCompanyPrice, getDepartureMoment } from '~/utils/companies';
import { slugify } from '~/utils/slugify';
import type { CompanyCity, CompanyDeparture, CompanyPageStats, CompanyRoute } from '~/types/company';

const props = defineProps<{
  routes: CompanyRoute[];
  cities: CompanyCity[];
  stats: CompanyPageStats;
}>();

/** Départs affichés avant de devoir déplier le reste de la ligne. */
const PREVIEW_SIZE = 4;
/** En dessous, les filtres encombrent plus qu'ils n'aident. */
const SEARCH_THRESHOLD = 2;

const MOMENT_OPTIONS = ['Tous', 'Matin', 'Après-midi', 'Soir'] as const;
type Moment = (typeof MOMENT_OPTIONS)[number];

const ALL_CITIES = 'Toutes';

const query = ref('');
const city = ref<string>(ALL_CITIES);
const moment = ref<Moment>('Tous');
const routeKey = (route: CompanyRoute) => `${route.fromSlug}-${route.toSlug}`;

// La ligne la plus desservie est dépliée d'office, côté serveur comme côté
// client : c'est celle que la compagnie met en avant en partageant sa page.
const firstRoute = props.routes[0];
const opened = reactive(new Set<string>(firstRoute ? [routeKey(firstRoute)] : []));
const expanded = reactive(new Set<string>());

const showSearch = computed(() => props.routes.length > SEARCH_THRESHOLD);
const cityOptions = computed(() => [ALL_CITIES, ...props.cities.map(item => item.name)]);

/** Comparaison insensible aux accents et à la casse. */
const normalize = (value: string) => slugify(value).replace(/-/g, ' ');

const matchesMoment = (slot: CompanyDeparture) =>
  moment.value === 'Tous' || getDepartureMoment(slot.departureTime) === moment.value;

const describeSlot = (slot: CompanyDeparture): string =>
  [slot.duration, slot.comfort].filter(Boolean).join(' · ');

const visibleRoutes = computed(() => {
  const search = normalize(query.value.trim());

  return props.routes
    .filter((route) => {
      if (city.value !== ALL_CITIES && route.from !== city.value && route.to !== city.value) {
        return false;
      }

      if (search) {
        const haystack = normalize([route.from, route.to, ...route.stations].join(' '));

        if (!haystack.includes(search)) return false;
      }

      return route.schedule.some(matchesMoment);
    })
    .map((route) => {
      const key = routeKey(route);
      const schedule = route.schedule.filter(matchesMoment);
      const visible = expanded.has(key) ? schedule : schedule.slice(0, PREVIEW_SIZE);
      const remaining = schedule.length - visible.length;
      // Une recherche en cours déplie tout : c'est ce que l'on vient chercher.
      const open = Boolean(search) || opened.has(key);

      return {
        key,
        route,
        open,
        visible,
        matched: schedule.length,
        hasMore: remaining > 0,
        moreLabel: remaining === 1
          ? 'Afficher le dernier départ'
          : `Afficher les ${remaining} départs suivants`,
        toggleLabel: open
          ? 'Masquer les horaires'
          : schedule.length === 1
            ? "Voir l'unique départ"
            : `Voir les ${schedule.length} départs`,
        price: formatCompanyPrice(route.minPrice),
        meta: [
          `${schedule.length} ${schedule.length > 1 ? 'départs' : 'départ'}`,
          route.durationSpan,
          route.stations.join(', ')
        ].filter(Boolean).join(' · ')
      };
    });
});

const resultLine = computed(() => {
  const lines = visibleRoutes.value.length;

  if (lines === 0) return 'Aucune ligne ne correspond';

  const departures = visibleRoutes.value.reduce((total, entry) => total + entry.matched, 0);

  return `${lines} ligne${lines > 1 ? 's' : ''} · ${departures} départ${departures > 1 ? 's' : ''}`;
});

const chipStyle = (active: boolean) => ({
  background: active ? 'var(--gy-brand)' : 'var(--gy-surface)',
  color: active ? 'var(--gy-on-brand-chip)' : 'var(--gy-ink)',
  border: `1px solid ${active ? 'var(--gy-brand)' : 'var(--gy-line)'}`
});

const toggle = (key: string) => {
  if (opened.has(key)) {
    opened.delete(key);
  } else {
    opened.add(key);
  }
};

const resetFilters = () => {
  query.value = '';
  city.value = ALL_CITIES;
  moment.value = 'Tous';
};
</script>
