<template>
  <header class="relative overflow-hidden" :style="{ background: 'var(--gy-hero-bg)', color: 'var(--gy-on-brand)' }">
    <div class="absolute inset-0 pointer-events-none" :style="{ background: 'var(--gy-hero-wash)' }" />

    <div class="relative container mx-auto px-4 lg:px-10 pt-6 pb-8 lg:pt-8 lg:pb-9">
      <nav aria-label="Fil d'ariane" class="text-xs mb-6" :style="{ color: 'var(--gy-on-brand-soft)' }">
        <ol class="flex flex-wrap items-center gap-2">
          <li><NuxtLink to="/" class="hover:opacity-100 opacity-80 transition-opacity">Accueil</NuxtLink></li>
          <li aria-hidden="true">/</li>
          <li><NuxtLink to="/compagnies" class="hover:opacity-100 opacity-80 transition-opacity">Compagnies</NuxtLink></li>
          <li aria-hidden="true">/</li>
          <li class="font-medium" :style="{ color: 'var(--gy-on-brand)' }">{{ company.name }}</li>
        </ol>
      </nav>

      <div class="grid gap-6 lg:gap-9 items-start lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div class="flex items-center gap-3.5">
            <div
              class="shrink-0 flex items-center justify-center overflow-hidden rounded-2xl h-[58px] w-[58px] lg:h-[76px] lg:w-[76px] font-bold text-xl lg:text-[26px] tracking-[-0.02em]"
              :style="{ background: 'var(--gy-logo-bg)', border: '1px solid var(--gy-on-brand-faint)' }"
            >
              <img
                v-if="company.logoUrl"
                :src="company.logoUrl"
                :alt="`Logo ${company.name}`"
                class="h-full w-full object-contain p-2"
              >
              <span v-else>{{ getCompanyInitials(company.name) }}</span>
            </div>

            <div class="min-w-0">
              <h1 class="text-3xl lg:text-[44px] leading-[1.05] font-bold tracking-[-0.03em]">
                {{ company.name }}
              </h1>
              <p class="mt-1.5 text-[13px] font-medium" :style="{ color: 'var(--gy-on-brand-soft)' }">
                Compagnie de cars interurbains · Page officielle
              </p>
            </div>
          </div>

          <p
            v-if="company.description"
            class="mt-[18px] max-w-[46ch] text-sm leading-relaxed"
            :style="{ color: 'var(--gy-on-brand-soft)' }"
          >
            {{ company.description }}
          </p>

          <!-- Tous ces chiffres sont comptés depuis les départs en base -->
          <ul class="flex flex-wrap gap-2 mt-5">
            <li
              v-for="chip in statChips"
              :key="chip.label"
              class="flex flex-col rounded-xl px-3.5 py-2.5 min-w-[78px]"
              :style="{ background: 'var(--gy-on-brand-faint)' }"
            >
              <span class="text-[19px] font-bold tracking-[-0.02em]">{{ chip.value }}</span>
              <span class="text-[11px] font-medium" :style="{ color: 'var(--gy-on-brand-soft)' }">
                {{ chip.label }}
              </span>
            </li>
          </ul>

          <div class="flex flex-wrap gap-2.5 mt-5">
            <a
              v-if="primaryPhone"
              :href="`tel:${toPhoneHref(primaryPhone)}`"
              class="flex items-center gap-2 px-[18px] py-3 min-h-[44px] rounded-xl text-sm font-semibold text-white transition-colors bg-corail-500 hover:bg-[#f2573a]"
            >
              <Phone class="w-4 h-4" />
              Appeler {{ company.name }}
            </a>

            <a
              v-if="whatsappHref"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-[18px] py-3 min-h-[44px] rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
              :style="{
                background: 'var(--gy-on-brand-faint)',
                border: '1px solid var(--gy-on-brand-line)',
                color: 'var(--gy-on-brand)'
              }"
            >
              <MessageCircle class="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <!-- Panneau réservé au desktop : sur mobile, les horaires complets
             arrivent juste en dessous, le doublon n'apporterait rien. -->
        <aside
          v-if="nextDepartures.length"
          class="hidden lg:block rounded-[18px] p-[18px] shadow-[0_18px_40px_rgba(10,37,64,.18)]"
          :style="{ background: 'var(--gy-surface)', color: 'var(--gy-ink)' }"
        >
          <div class="flex items-baseline justify-between mb-3.5">
            <h2 class="text-sm font-semibold tracking-[-0.01em]">Premiers départs</h2>
            <span class="text-[11px] font-medium" :style="{ color: 'var(--gy-muted)' }">de la journée</span>
          </div>

          <ul>
            <li
              v-for="(slot, index) in nextDepartures"
              :key="`${slot.from}-${slot.to}-${slot.departureTime}-${index}`"
              class="flex items-center gap-3 py-[11px]"
              :style="{ borderTop: '1px solid var(--gy-line)' }"
            >
              <span
                class="w-[52px] text-base font-bold tabular-nums tracking-[-0.02em]"
                :style="{ color: 'var(--gy-brand-ink)' }"
              >
                {{ slot.departureTime }}
              </span>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-semibold truncate">{{ slot.from }} → {{ slot.to }}</p>
                <p class="text-[11px] truncate" :style="{ color: 'var(--gy-muted)' }">
                  {{ describeSlot(slot) }}
                </p>
              </div>
              <span v-if="formatCompanyPrice(slot.price)" class="text-[13px] font-semibold tabular-nums">
                {{ formatCompanyPrice(slot.price) }}
              </span>
            </li>
          </ul>

          <p class="mt-3.5 text-[11px] leading-[1.5]" :style="{ color: 'var(--gy-muted)' }">
            Les places se prennent par téléphone auprès de {{ company.name }}.
          </p>
        </aside>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Phone, MessageCircle } from 'lucide-vue-next';
import {
  formatCompanyPrice,
  formatPriceRange,
  getCompanyInitials,
  parseCompanyPhones,
  toPhoneHref
} from '~/utils/companies';
import type { CompanyNextDeparture, CompanyPageCompany, CompanyPageStats } from '~/types/company';

const props = defineProps<{
  company: CompanyPageCompany;
  stats: CompanyPageStats;
  nextDepartures: CompanyNextDeparture[];
}>();

const primaryPhone = computed(() => parseCompanyPhones(props.company.contact)[0] ?? null);

const whatsappHref = computed(() => {
  const number = props.company.whatsapp?.trim();

  return number ? `https://wa.me/${toPhoneHref(number).replace('+', '')}` : null;
});

// Une compagnie sans prix en base ne doit pas afficher une pastille vide.
const statChips = computed(() => {
  const chips: Array<{ value: string | number; label: string }> = [
    { value: props.stats.departures, label: props.stats.departures > 1 ? 'départs référencés' : 'départ référencé' },
    { value: props.stats.routes, label: props.stats.routes > 1 ? 'lignes' : 'ligne' },
    { value: props.stats.cities, label: props.stats.cities > 1 ? 'villes' : 'ville' }
  ];

  const range = formatPriceRange(props.stats.minPrice, props.stats.maxPrice);

  if (range) {
    chips.push({ value: range, label: 'prix des places' });
  }

  return chips;
});

/** Gare, confort et durée d'un départ, sans les séparateurs des champs vides. */
const describeSlot = (slot: CompanyNextDeparture): string =>
  [slot.station, slot.comfort, slot.duration].filter(Boolean).join(' · ');
</script>
