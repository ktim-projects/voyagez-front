<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('home.advantages.title') }}</h2>
        <p class="text-gray-600">{{ $t('home.advantages.subtitle') }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(advantage, index) in advantages" :key="index" 
             class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center">
              <AppIcon :name="advantage.icon" class="h-6 w-6 text-coral-600" />
            </div>
            <h3 class="text-xl font-semibold text-primary-900">{{ $t(advantage.titleKey) }}</h3>
          </div>
          <p class="text-gray-600">{{ $t(advantage.descriptionKey) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>



<script setup lang="ts">

const advantages = [
  {
    titleKey: 'home.advantages.timeGain.title',
    descriptionKey: 'home.advantages.timeGain.description',
    icon: 'Clock'
  },
  {
    titleKey: 'home.advantages.bestPrices.title',
    descriptionKey: 'home.advantages.bestPrices.description',
    icon: 'Wallet'
  },
  {
    titleKey: 'home.advantages.reliability.title',
    descriptionKey: 'home.advantages.reliability.description',
    icon: 'ShieldCheck'
  },
]
</script>
