<template>
  <aside class="flex flex-col gap-3">
    <div
      v-if="phones.length || company.email || company.website"
      class="rounded-2xl p-4"
      :style="{ background: 'var(--gy-surface)', border: '1px solid var(--gy-line)' }"
    >
      <h2 class="text-[11px] font-semibold uppercase tracking-[.07em]" :style="{ color: 'var(--gy-muted)' }">
        Contacter {{ company.name }}
      </h2>

      <div class="mt-3 flex flex-col gap-2.5">
        <a
          v-for="phone in phones"
          :key="phone"
          :href="`tel:${toPhoneHref(phone)}`"
          class="flex items-center justify-between gap-2.5 px-3 py-2.5 min-h-[44px] rounded-[11px] text-[15px] font-semibold tabular-nums transition-opacity hover:opacity-80"
          :style="{ background: 'var(--gy-chip-bg)', color: 'var(--gy-ink)' }"
        >
          <span>{{ phone }}</span>
          <Phone class="w-4 h-4 shrink-0" :style="{ color: 'var(--gy-brand-ink)' }" />
        </a>

        <a
          v-if="company.email"
          :href="`mailto:${company.email}`"
          class="text-[13px] font-medium hover:underline break-all"
          :style="{ color: 'var(--gy-brand-ink)' }"
        >
          {{ company.email }}
        </a>

        <a
          v-if="company.website"
          :href="company.website"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[13px] font-medium hover:underline break-all"
          :style="{ color: 'var(--gy-brand-ink)' }"
        >
          {{ websiteLabel }}
        </a>
      </div>
    </div>

    <div
      v-if="stations.length"
      class="rounded-2xl p-4"
      :style="{ background: 'var(--gy-surface)', border: '1px solid var(--gy-line)' }"
    >
      <h2 class="text-[11px] font-semibold uppercase tracking-[.07em]" :style="{ color: 'var(--gy-muted)' }">
        Gares de départ
      </h2>
      <ul class="mt-2.5 flex flex-wrap gap-1.5">
        <li
          v-for="station in stations"
          :key="station"
          class="text-xs font-medium px-2.5 py-1.5 rounded-full"
          :style="{ background: 'var(--gy-chip-bg)', color: 'var(--gy-chip-ink)' }"
        >
          {{ station }}
        </li>
      </ul>
    </div>

    <div
      v-if="comfortCategories.length"
      class="rounded-2xl p-4"
      :style="{ background: 'var(--gy-surface)', border: '1px solid var(--gy-line)' }"
    >
      <h2 class="text-[11px] font-semibold uppercase tracking-[.07em]" :style="{ color: 'var(--gy-muted)' }">
        Catégories de confort
      </h2>
      <ul class="mt-2.5 flex flex-col gap-2">
        <li
          v-for="category in comfortCategories"
          :key="category"
          class="flex items-center gap-2.5 text-[13px] font-medium"
          :style="{ color: 'var(--gy-ink)' }"
        >
          <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: 'var(--gy-brand-ink)' }" />
          {{ category }}
        </li>
      </ul>
    </div>

    <div
      v-if="company.services.length"
      class="rounded-2xl p-4"
      :style="{ background: 'var(--gy-surface)', border: '1px solid var(--gy-line)' }"
    >
      <h2 class="text-[11px] font-semibold uppercase tracking-[.07em]" :style="{ color: 'var(--gy-muted)' }">
        À bord
      </h2>
      <ul class="mt-2.5 flex flex-wrap gap-1.5">
        <li
          v-for="service in company.services"
          :key="service"
          class="text-xs font-medium px-2.5 py-1.5 rounded-full"
          :style="{ background: 'var(--gy-chip-bg)', color: 'var(--gy-chip-ink)' }"
        >
          {{ service }}
        </li>
      </ul>
    </div>

    <!-- Geyavo s'arrête aux horaires : le dire plutôt que le laisser deviner -->
    <div
      class="rounded-2xl p-4"
      :style="{ background: 'var(--gy-notice-bg)', border: '1px solid var(--gy-notice-line)' }"
    >
      <p class="text-[13px] font-semibold" :style="{ color: 'var(--gy-notice-ink)' }">
        Geyavo n'émet pas de billets
      </p>
      <p class="mt-1.5 text-xs leading-[1.55]" :style="{ color: 'var(--gy-notice-soft)' }">
        Nous publions les horaires. Les places se prennent directement auprès de
        {{ company.name }}, par téléphone ou à la gare.
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Phone } from 'lucide-vue-next';
import { parseCompanyPhones, toPhoneHref } from '~/utils/companies';
import type { CompanyPageCompany } from '~/types/company';

const props = defineProps<{
  company: CompanyPageCompany;
  stations: string[];
  comfortCategories: string[];
}>();

const phones = computed(() => parseCompanyPhones(props.company.contact));

/** Le domaine se lit mieux que l'URL complète dans une carte étroite. */
const websiteLabel = computed(() => {
  const website = props.company.website;

  if (!website) return '';

  try {
    return new URL(website.startsWith('http') ? website : `https://${website}`).hostname
      .replace(/^www\./, '');
  } catch {
    return website;
  }
});
</script>
