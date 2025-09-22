// import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  ssr: false,

  // Configuration des variables d'environnement runtime
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/styles/main.scss'
  ],

  build: {
    transpile: ['primevue']
  },

  i18n: {
    defaultLocale: 'fr',
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ]
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
    preset: 'vercel'
  },

  typescript: {
    strict: true,
    shim: false
  },

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-12-16'
});