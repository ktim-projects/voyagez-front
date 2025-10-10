<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full text-center">

      <!-- Icône de maintenance -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div class="absolute inset-0 bg-white/10 rounded-full blur-2xl"></div>
          <div class="relative bg-white/10 backdrop-blur-sm rounded-full p-8 border border-white/20">
            <Settings class="w-20 h-20 text-white animate-spin-slow" />
          </div>
        </div>
      </div>

      <!-- Message principal -->
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
        Maintenance en cours
      </h2>
      
      <p class="text-xl text-primary-100 mb-8 leading-relaxed">
        Nous effectuons actuellement des améliorations pour vous offrir une meilleure expérience.
        <br class="hidden md:block">
        Nous serons de retour très bientôt !
      </p>

      <!-- Informations supplémentaires -->
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
        <div class="flex items-start gap-4 text-left">
          <Info class="w-6 h-6 text-primary-200 flex-shrink-0 mt-1" />
          <div class="text-primary-100">
            <p class="font-medium mb-2">Que se passe-t-il ?</p>
            <p class="text-sm text-primary-200 leading-relaxed">
              Notre équipe technique travaille sur des mises à jour importantes pour améliorer 
              les performances et ajouter de nouvelles fonctionnalités. Cette maintenance est 
              nécessaire pour vous garantir le meilleur service possible.
            </p>
          </div>
        </div>
      </div>


      <!-- Contact -->
      <div class="text-primary-200 text-sm">
        <p class="mb-2">Besoin d'aide urgente ?</p>
        <a 
          href="mailto:contact@geyavo.com" 
          class="inline-flex items-center gap-2 text-white hover:text-primary-100 transition-colors"
        >
          <Mail class="w-4 h-4" />
          contact@geyavo.com
        </a>
      </div>

      <!-- Footer -->
      <div class="mt-12 pt-8 border-t border-white/10">
        <p class="text-primary-300 text-sm">
          © {{ new Date().getFullYear() }} Geyavo. Tous droits réservés.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings, Info, Clock, Mail } from 'lucide-vue-next'

// SEO pour la page de maintenance
useHead({
  title: 'Maintenance en cours - Geyavo',
  meta: [
    { name: 'description', content: 'Geyavo est actuellement en maintenance. Nous serons de retour très bientôt avec des améliorations.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
