// import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  ssr: true,

  // Configuration des variables d'environnement runtime
  runtimeConfig: {
    // Variables côté serveur (privées)
    apiKeyFrontend: process.env.API_KEY_FRONTEND,
    apiKeyAdmin: process.env.API_KEY_ADMIN,
    apiKeyStats: process.env.API_KEY_STATS,
    brevoApiKey: process.env.BREVO_API_KEY,
    
    // Variables publiques (côté client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      apiKeyFrontend: process.env.API_KEY_FRONTEND,
      // Mode maintenance
      maintenanceMode: process.env.MAINTENANCE_MODE || 'false',
      maintenanceAllowedIPs: process.env.MAINTENANCE_ALLOWED_IPS || '',
      // Mode coming soon
      comingSoonMode: process.env.COMING_SOON_MODE || 'false',
      comingSoonAllowedIPs: process.env.COMING_SOON_ALLOWED_IPS || '',
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
      title: 'Geyavo - Trouvez le meilleur itinéraire',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Comparez et trouvez les meilleurs itinéraires de bus et cars en Côte d\'Ivoire' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' }
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