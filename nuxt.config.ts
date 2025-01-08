export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/supabase'
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: ''
  },

  app: {
    head: {
      title: 'VoyageCompare - Trouvez le meilleur itinéraire',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Comparez et trouvez les meilleurs itinéraires de bus et cars en Côte d\'Ivoire' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  nitro: {
    preset: 'node-server'
  },

  typescript: {
    strict: true,
    shim: false
  },

  supabase: {
    redirect: false,
    url: 'https://xgzetswtddvvgedpxzbx.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnemV0c3d0ZGR2dmdlZHB4emJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNjYyMDUsImV4cCI6MjA1MDY0MjIwNX0.Y59zSkr369-5-8dv11pKveMuG0aVQrYVvHY8_Yo16cM'
  },

  devtools: { enabled: false },
  compatibilityDate: '2024-12-16'
});