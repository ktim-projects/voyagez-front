<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Pourquoi nous choisir ?</h2>
        <p class="text-gray-600">Nous vous offrons la meilleure expérience de voyage possible</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(advantage, index) in advantages" :key="index" 
             class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
            <component :is="advantage.icon" class="h-6 w-6 text-primary-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ advantage.title }}</h3>
          <p class="text-gray-600">{{ advantage.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>



<script setup lang="ts">
import { Clock, ShieldCheck, Wallet } from 'lucide-vue-next'

const advantages = [
  {
    title: 'Gain de temps',
    description: 'Trouvez rapidement le meilleur trajet sans passer des heures à comparer.',
    icon: Clock
  },
  {
    title: 'Meilleurs prix',
    description: "Comparez les prix et choisissez l'option la plus économique.",
    icon: Wallet
  },
  {
    title: 'Fiabilité',
    description: "Des informations à jour et vérifiées pour voyager en toute tranquillité.",
    icon: ShieldCheck
  },
]
</script>
