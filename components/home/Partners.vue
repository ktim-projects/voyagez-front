<template>
  <ClientOnly>
    <div class="hidden md:block bg-white py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-12">
          <!-- Texte à gauche -->
          <div class="md:w-1/2">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">
              {{ $t('home.partners.title') }}
            </h2>
            <p class="text-gray-600 mb-8 text-lg">
              {{ $t('home.partners.description') }}
            </p>
            <AppButton variant="coral" :label="$t('home.partners.button')" :fullWidth="false" />
          </div>

          <!-- Partenaires à droite -->
          <div class="md:w-1/2">
            <div class="grid grid-cols-2 gap-8">
              <div class="flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Air_Ivoire_logo.png" alt="Air Ivoire" class="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300">
              </div>
              <div class="flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/90/Air_C%C3%B4te_d%27Ivoire_Logo.svg" alt="Air Côte d'Ivoire" class="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300">
              </div>
              <div class="flex items-center justify-center">
                <img src="https://seeklogo.com/images/S/sotra-logo-D8778E8F24-seeklogo.com.png" alt="SOTRA" class="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300">
              </div>
              <div class="flex items-center justify-center">
                <img src="https://stlci.com/wp-content/uploads/2021/09/logo-stl.png" alt="STL" class="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
</script>