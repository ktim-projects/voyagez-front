<template>
  <main class="min-h-screen dark:bg-gray-950">
    <HomeHeroSection />
    <HomeSearchForm />
    <HomeAdvantages />
    <!-- <HomeHowItWorks /> -->
    <HomePopularDestinations />
    <HomePartners />
    <HomeFAQ />
    <HomeNewsletter />
  </main>
</template>

<script setup lang="ts">
// SEO optimisé pour la page d'accueil
useHead({
  title: 'Geyavo - Réservation de transport en car et bus en Côte d\'Ivoire',
  meta: [
    // Description principale
    {
      name: 'description',
      content: 'Réservez vos trajets en car et bus en Côte d\'Ivoire avec Geyavo. Comparez les prix, horaires et compagnies. Transport fiable entre Abidjan, Yamoussoukro, Bouaké et toutes les villes.'
    },
    // Keywords
    {
      name: 'keywords',
      content: 'transport Côte d\'Ivoire, car, bus, réservation, voyage, Abidjan, Yamoussoukro, Bouaké, San Pedro, Korhogo, horaires, prix, compagnies transport'
    },
    // Robots
    {
      name: 'robots',
      content: 'index, follow'
    },
    // Author
    {
      name: 'author',
      content: 'Geyavo'
    },
    // Viewport (déjà défini dans nuxt.config mais on peut le renforcer)
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Geyavo - Transport en car et bus en Côte d\'Ivoire'
    },
    {
      property: 'og:description',
      content: 'La plateforme de référence pour réserver vos trajets en car et bus en Côte d\'Ivoire. Comparez et réservez en quelques clics.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://geyavo.com'
    },
    {
      property: 'og:site_name',
      content: 'Geyavo'
    },
    {
      property: 'og:locale',
      content: 'fr_CI'
    },
    {
      property: 'og:image',
      content: 'https://geyavo.com/og-image.jpg'
    },
    {
      property: 'og:image:width',
      content: '1200'
    },
    {
      property: 'og:image:height',
      content: '630'
    },
    {
      property: 'og:image:alt',
      content: 'Geyavo - Transport en Côte d\'Ivoire'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Geyavo - Transport en car et bus en Côte d\'Ivoire'
    },
    {
      name: 'twitter:description',
      content: 'Réservez vos trajets en car et bus en Côte d\'Ivoire. Comparez les prix et horaires des meilleures compagnies.'
    },
    {
      name: 'twitter:image',
      content: 'https://geyavo.com/twitter-image.jpg'
    },
    {
      name: 'twitter:image:alt',
      content: 'Geyavo - Transport en Côte d\'Ivoire'
    },
    // Geo tags
    {
      name: 'geo.region',
      content: 'CI'
    },
    {
      name: 'geo.country',
      content: 'Côte d\'Ivoire'
    },
    {
      name: 'geo.placename',
      content: 'Côte d\'Ivoire'
    },
    // Mobile
    {
      name: 'mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default'
    },
    // Theme color
    {
      name: 'theme-color',
      content: '#132968'
    },
    {
      name: 'msapplication-TileColor',
      content: '#132968'
    }
  ],
  link: [
    // Canonical URL
    {
      rel: 'canonical',
      href: 'https://geyavo.com'
    },
    // Preconnect pour les performances
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    // Favicon et icons
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png'
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest'
    }
  ],
  script: [
    // Données structurées JSON-LD pour la page d'accueil
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Geyavo',
        description: 'Plateforme de réservation de transport en car et bus en Côte d\'Ivoire',
        url: 'https://geyavo.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://geyavo.com/results?from={from}&to={to}&type={type}'
          },
          'query-input': 'required name=from required name=to required name=type'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Geyavo',
          url: 'https://geyavo.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://geyavo.com/logo.png',
            width: 300,
            height: 100
          },
          description: 'Plateforme de réservation de transport en Côte d\'Ivoire',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'CI',
            addressRegion: 'Côte d\'Ivoire'
          },
          areaServed: {
            '@type': 'Country',
            name: 'Côte d\'Ivoire'
          },
          serviceType: 'Transport de passagers'
        },
        mainEntity: {
          '@type': 'Service',
          name: 'Réservation de transport',
          description: 'Service de réservation de trajets en car et bus en Côte d\'Ivoire',
          provider: {
            '@type': 'Organization',
            name: 'Geyavo'
          },
          areaServed: {
            '@type': 'Country',
            name: 'Côte d\'Ivoire'
          },
          serviceType: 'Transport booking'
        }
      })
    },
    // Données structurées pour l'organisation
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Geyavo',
        url: 'https://geyavo.com',
        logo: 'https://geyavo.com/logo.png',
        description: 'Plateforme de réservation de transport en car et bus en Côte d\'Ivoire',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'CI'
        },
        areaServed: {
          '@type': 'Country',
          name: 'Côte d\'Ivoire'
        },
        knowsAbout: [
          'Transport en car',
          'Transport en bus',
          'Réservation de voyage',
          'Côte d\'Ivoire',
          'Abidjan',
          'Yamoussoukro',
          'Bouaké'
        ]
      })
    }
  ]
});
</script>