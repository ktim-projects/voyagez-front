<template>
  <div class="bg-coral-50 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl text-primary-900 font-bold mb-4">{{ $t('home.newsletter.title') }}</h2>
        <p class="text-gray-600 mb-8">{{ $t('home.newsletter.subtitle') }}</p>
        <form class="flex flex-col sm:flex-row gap-4">
          <input type="email" :placeholder="$t('home.newsletter.placeholder')" 
            class="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
          <AppButton 
            variant="coral" 
            :label="$t('home.newsletter.button')"
            :fullWidth="false"
          />
        </form>
      </div>
    </div>
  </div>
</template>