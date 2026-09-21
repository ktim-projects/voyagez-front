<template>
  <main v-if="data" class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <CompanyHero :company="data.company" :stats="data.stats" />
    <CompanyStats :stats="data.stats" />

    <div class="container mx-auto px-4 py-10 space-y-10">
      <CompanyRoutes
        :routes="data.routes"
        :company-name="data.company.name"
        :company-slug="data.company.slug"
      />

      <CompanyNetwork
        :cities="data.cities"
        :stations="data.stations"
        :comfort-categories="data.comfortCategories"
        :services="data.company.services"
      />

      <!-- Rappel honnête du périmètre : Geyavo ne vend pas de billets -->
      <section class="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Comment voyager avec {{ data.company.name }} ?
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
          Geyavo référence les horaires et les prix de {{ data.company.name }} pour vous aider à
          comparer. Les réservations se font directement auprès de la compagnie, par téléphone
          ou à la gare : utilisez les coordonnées en haut de cette page.
        </p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
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
