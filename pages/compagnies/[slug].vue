<template>
  <main
    v-if="data"
    class="min-h-screen"
    :style="{ ...themeVariables, background: 'var(--gy-page-bg)', color: 'var(--gy-ink)' }"
  >
    <CompanyHero
      :company="data.company"
      :stats="data.stats"
      :next-departures="data.nextDepartures"
    />

    <div class="container mx-auto px-4 lg:px-10 py-6 lg:py-9 grid gap-6 lg:gap-9 items-start lg:grid-cols-[1.5fr_.8fr]">
      <div>
        <CompanySchedule
          :routes="data.routes"
          :cities="data.cities"
          :stats="data.stats"
        />

        <CompanyDestinations
          :cities="data.cities"
          :company-name="data.company.name"
        />
      </div>

      <CompanySidebar
        :company="data.company"
        :stations="data.stations"
        :comfort-categories="data.comfortCategories"
      />
    </div>

    <div
      class="px-4 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-2"
      :style="{ background: 'var(--gy-surface)', borderTop: '1px solid var(--gy-line)' }"
    >
      <p class="text-[11px]" :style="{ color: 'var(--gy-muted)' }">
        Horaires {{ data.company.name }}<span v-if="citiesLine"> · {{ citiesLine }}</span>
      </p>
      <NuxtLink to="/compagnies" class="text-[11px] hover:underline" :style="{ color: 'var(--gy-muted)' }">
        Toutes les compagnies
      </NuxtLink>
    </div>

    <CompanyCallBar :phone="primaryPhone" :company-name="data.company.name" />
  </main>
</template>

<script setup lang="ts">
import { parseCompanyPhones } from '~/utils/companies';
import { buildCompanyTheme, toThemeVariables } from '~/utils/company-theme';
import type { CompanyPageResponse } from '~/types/company';

const route = useRoute();
const { secureApiFetch } = useSecureApi();

const slug = computed(() => String(route.params.slug ?? ''));

// Rendu serveur : la page a vocation à être indexée et partagée sur les
// réseaux, son contenu doit être dans le HTML servi (cf. CLAUDE.md).
const { data, error } = await useAsyncData(
  `company-${slug.value}`,
  () => secureApiFetch<CompanyPageResponse>(`/api/car/companies/${slug.value}`),
  { watch: [slug] }
);

// useAsyncData capture l'erreur de son handler au lieu de la propager : sans
// ce relais, une compagnie inconnue répondrait 200 sur une page vide.
if (error.value) {
  const statusCode = (error.value as { statusCode?: number }).statusCode === 404 ? 404 : 500;

  throw createError({
    statusCode,
    statusMessage: statusCode === 404 ? 'Company not found' : 'Erreur de chargement',
    fatal: true
  });
}

const company = computed(() => data.value?.company ?? null);
const stats = computed(() => data.value?.stats ?? null);

// La page prend les couleurs de la compagnie : la palette est calculée une
// fois ici et diffusée aux composants en variables CSS. Sans cela, les
// classes seraient construites dynamiquement et Tailwind les purgerait.
const themeVariables = computed(() => toThemeVariables(buildCompanyTheme(company.value?.brandColor)));

const primaryPhone = computed(() => parseCompanyPhones(company.value?.contact)[0] ?? null);

const citiesLine = computed(() =>
  (data.value?.cities ?? []).map(city => city.name).join(', ')
);

const seo = computed(() => {
  const name = company.value?.name ?? 'Compagnie';
  const cityNames = (data.value?.cities ?? []).slice(0, 6).map(city => city.name).join(', ');

  const descriptionParts = [
    `Horaires, prix et gares de ${name} en Côte d'Ivoire.`
  ];

  if (stats.value?.routes) {
    descriptionParts.push(`${stats.value.routes} trajets référencés`);
  }
  if (cityNames) {
    descriptionParts.push(`au départ de ${cityNames}.`);
  }

  return {
    title: `${name} — horaires, trajets et contacts | Geyavo`,
    description: descriptionParts.join(' '),
    canonical: `https://geyavo.com/compagnies/${company.value?.slug ?? slug.value}`,
    // À défaut de visuel généré, le logo de la compagnie fait une vignette de
    // partage correcte sur WhatsApp et Facebook.
    image: company.value?.logoUrl ?? 'https://geyavo.com/logos/geyavo_full.png'
  };
});

useHead(() => ({
  title: seo.value.title,
  meta: [
    { name: 'description', content: seo.value.description },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'profile' },
    { property: 'og:title', content: seo.value.title },
    { property: 'og:description', content: seo.value.description },
    { property: 'og:url', content: seo.value.canonical },
    { property: 'og:image', content: seo.value.image },
    { property: 'og:site_name', content: 'Geyavo' },
    { property: 'og:locale', content: 'fr_CI' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.value.title },
    { name: 'twitter:description', content: seo.value.description },
    { name: 'twitter:image', content: seo.value.image },
    { name: 'geo.region', content: 'CI' }
  ],
  link: [
    { rel: 'canonical', href: seo.value.canonical }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: company.value?.name,
        url: seo.value.canonical,
        ...(company.value?.logoUrl ? { logo: company.value.logoUrl } : {}),
        ...(company.value?.description ? { description: company.value.description } : {}),
        ...(company.value?.email ? { email: company.value.email } : {}),
        ...(company.value?.contact ? { telephone: company.value.contact } : {}),
        ...(company.value?.website ? { sameAs: [company.value.website] } : {}),
        address: { '@type': 'PostalAddress', addressCountry: 'CI' },
        areaServed: (data.value?.cities ?? []).map(city => ({
          '@type': 'City',
          name: city.name
        }))
      })
    }
  ]
}));
</script>
