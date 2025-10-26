<template>
  <ClientOnly>
    <div class="hidden md:block bg-white dark:bg-gray-900 py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-12">
          <!-- Texte à gauche -->
          <div class="md:w-1/2">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {{ $t('home.partners.title') }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              {{ $t('home.partners.description') }}
            </p>
            <AppButton variant="corail" :label="$t('home.partners.button')" :fullWidth="false" />
          </div>

          <!-- Partenaires à droite -->
          <div class="md:w-1/2">
            <div class="flex flex-wrap items-center justify-center gap-4">
              <div 
                v-for="partner in partners" 
                :key="partner.name"
                class="relative flex items-center justify-center bg-white rounded-lg p-4 group cursor-pointer"
                :style="{ width: partner.size, height: partner.size }"
              >
                <img 
                  :src="partner.logo" 
                  :alt="partner.name" 
                  class="w-full h-full object-contain"
                  loading="lazy"
                >
                <!-- Tooltip au hover -->
                <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  {{ partner.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
// Liste des partenaires
const partners = [
  {
    name: 'Rahimo',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/rahimo_logo.jpg',
    size: '100px' // Taille personnalisée
  },
  {
    name: 'UTB',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/utb.jpg',
    size: '80px'
  },
  {
    name: 'TSR',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/tsr_logo.jpg',
    size: '50px'
  },
  {
    name: 'Sido',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/sido_logo.jpg',
    size: '90px'
  },
  {
    name: 'SHT',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/sht_logo.jpg',
    size: '80px'
  },
  {
    name: 'SBTA',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/sbta.png',
    size: '80px'
  },
  {
    name: 'ART',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/art_logo.jpg',
    size: '80px'
  },
  {
    name: 'Jet Express',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/jet_logo.jpg',
    size: '80px'
  },
  {
    name: 'UTB 5',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/utb.jpg',
    size: '80px'
  },
  {
    name: 'UTB 5',
    logo: 'https://xgzetswtddvvgedpxzbx.supabase.co/storage/v1/object/public/companies_logo/utb.jpg',
    size: '80px'
  }
]
</script>