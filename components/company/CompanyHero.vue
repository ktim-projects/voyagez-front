<template>
  <header
    class="relative overflow-hidden text-white"
    :style="heroStyle"
  >
    <div class="container mx-auto px-4 py-10 md:py-14">
      <nav aria-label="Fil d'ariane" class="text-sm text-white/70">
        <ol class="flex flex-wrap items-center gap-2">
          <li><NuxtLink to="/" class="hover:text-white transition-colors">Accueil</NuxtLink></li>
          <li aria-hidden="true">/</li>
          <li><NuxtLink to="/compagnies" class="hover:text-white transition-colors">Compagnies</NuxtLink></li>
          <li aria-hidden="true">/</li>
          <li class="text-white font-medium">{{ company.name }}</li>
        </ol>
      </nav>

      <div class="flex flex-col md:flex-row md:items-start gap-6 mt-6">
        <!-- Logo ou initiales -->
        <div class="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
          <img
            v-if="company.logoUrl"
            :src="company.logoUrl"
            :alt="`Logo ${company.name}`"
            class="h-full w-full object-contain p-2"
          >
          <span v-else class="text-2xl md:text-3xl font-bold" :style="{ color: accent }">
            {{ getCompanyInitials(company.name) }}
          </span>
        </div>

        <div class="min-w-0">
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
            {{ company.name }}
          </h1>

          <p v-if="subtitle" class="mt-2 text-white/80 text-sm md:text-base">
            {{ subtitle }}
          </p>

          <p v-if="company.description" class="mt-4 max-w-2xl text-white/85 leading-relaxed">
            {{ company.description }}
          </p>

          <!-- Contacts : le parcours s'arrête ici, ce sont les vraies actions -->
          <div class="flex flex-wrap gap-3 mt-6">
            <a
              v-for="phone in phones"
              :key="phone"
              :href="`tel:${toPhoneHref(phone)}`"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white font-medium text-sm transition-transform duration-200 hover:scale-105"
              :style="{ color: accent }"
            >
              <Phone class="w-4 h-4" />
              {{ phone }}
            </a>

            <a
              v-if="company.whatsapp"
              :href="`https://wa.me/${company.whatsapp}`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/30 font-medium text-sm hover:bg-white/20 transition-colors"
            >
              <MessageCircle class="w-4 h-4" />
              WhatsApp
            </a>

            <a
              v-if="company.email"
              :href="`mailto:${company.email}`"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/30 font-medium text-sm hover:bg-white/20 transition-colors"
            >
              <Mail class="w-4 h-4" />
              Écrire
            </a>

            <a
              v-if="company.website"
              :href="company.website"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/30 font-medium text-sm hover:bg-white/20 transition-colors"
            >
              <Globe class="w-4 h-4" />
              Site officiel
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Phone, Mail, Globe, MessageCircle } from 'lucide-vue-next';
import { getCompanyInitials, parseCompanyPhones, toPhoneHref } from '~/utils/companies';
import type { CompanyPageCompany, CompanyPageStats } from '~/types/company';

const props = defineProps<{
  company: CompanyPageCompany;
  stats: CompanyPageStats;
}>();

// Couleur de marque de la compagnie, avec repli sur le primaire Geyavo.
// Appliquée en style inline : une classe Tailwind construite dynamiquement
// serait purgée du CSS final (cf. CLAUDE.md).
const accent = computed(() => props.company.brandColor || '#0A2540');

const heroStyle = computed(() => ({
  background: `linear-gradient(135deg, ${accent.value} 0%, ${darken(accent.value, 0.35)} 100%)`
}));

const subtitle = computed(() => {
  const parts: string[] = [];

  if (props.stats.cities > 0) {
    parts.push(`${props.stats.cities} ${props.stats.cities > 1 ? 'villes desservies' : 'ville desservie'}`);
  }
  if (props.stats.routes > 0) {
    parts.push(`${props.stats.routes} ${props.stats.routes > 1 ? 'trajets' : 'trajet'}`);
  }

  return parts.join(' · ');
});

const phones = computed(() => parseCompanyPhones(props.company.contact));

/**
 * Assombrit une couleur hexadécimale pour construire le dégradé de l'en-tête,
 * sans dépendre d'une bibliothèque de couleurs.
 */
function darken(hex: string, amount: number): string {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map(offset => {
    const channel = parseInt(value.slice(offset, offset + 2), 16);
    return Math.max(0, Math.round(channel * (1 - amount)));
  });

  return `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
}
</script>
