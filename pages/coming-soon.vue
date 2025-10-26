<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-4 py-4">
    <div class="max-w-4xl w-full">
      
      <div class="flex justify-center mb-4">
        <img 
          src="/logos/geyavo_full.png" 
          alt="Geyavo" 
          class="h-24 md:h-32 w-auto"
        />
      </div>

      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-corail-50 border border-corail-200 rounded-full px-6 py-2 mb-8">
          <Sparkles class="w-5 h-5 text-corail-500" />
          <span class="text-corail-600 font-medium">Bientôt disponible</span>
        </div>
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Voyagez en toute
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-corail-500 to-corail-600">
            simplicité
          </span>
        </h1>
        
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Toutes les informations sur les compagnies de transport et les lignes de bus réunies en un seul endroit. 
          Une nouvelle façon de voyager arrive bientôt.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
          <div class="bg-corail-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock class="w-6 h-6 text-corail-600" />
          </div>
          <h4 class="text-gray-900 font-semibold mb-2">Gain de temps</h4>
          <p class="text-gray-600 text-sm">Horaires, prix et contacts des compagnies en un seul endroit</p>
        </div>

        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
          <div class="bg-corail-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Wallet class="w-6 h-6 text-corail-600" />
          </div>
          <h4 class="text-gray-900 font-semibold mb-2">Meilleurs prix</h4>
          <p class="text-gray-600 text-sm">Comparez les prix des tickets ordinaires et VIP</p>
        </div>

        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
          <div class="bg-corail-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck class="w-6 h-6 text-corail-600" />
          </div>
          <h4 class="text-gray-900 font-semibold mb-2">Fiabilité</h4>
          <p class="text-gray-600 text-sm">Informations vérifiées et régulièrement mises à jour</p>
        </div>
      </div>

      <!-- Newsletter Form -->
      <div class="mt-16 max-w-xl mx-auto">
        <div class="bg-gradient-to-br from-corail-50 to-white rounded-2xl p-8 border border-corail-200">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              Soyez informé du lancement
            </h3>
            <p class="text-gray-600">
              Inscrivez-vous pour recevoir une notification dès que Geyavo sera disponible
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <input
                v-model="email"
                type="email"
                placeholder="Votre adresse email"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-corail-500 focus:ring-2 focus:ring-corail-200 outline-none transition-all"
                :class="{ 'border-red-500': emailError }"
                :disabled="isLoading"
              />
              <p v-if="emailError" class="text-red-500 text-sm mt-2">{{ emailError }}</p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-corail-500 to-corail-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-corail-600 hover:to-corail-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="!isLoading">M'informer du lancement</span>
              <span v-else>Inscription en cours...</span>
            </button>

            <p v-if="successMessage" class="text-green-600 text-sm text-center">
              {{ successMessage }}
            </p>
            <p v-if="errorMessage" class="text-red-500 text-sm text-center">
              {{ errorMessage }}
            </p>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-16 pt-8 border-t border-gray-200 text-center">
        <p class="text-gray-600 text-sm mb-4">
          Une question ? Contactez-nous à 
          <a href="mailto:contact@geyavo.com" class="text-corail-600 hover:text-corail-700 transition-colors font-medium">
            contact@geyavo.com
          </a>
        </p>
        <p class="text-gray-500 text-xs">
          © {{ new Date().getFullYear() }} Geyavo. Tous droits réservés.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Sparkles,
  Clock,
  Wallet,
  ShieldCheck
} from 'lucide-vue-next'

// Newsletter form
const email = ref('')
const emailError = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

async function handleSubmit() {
  emailError.value = ''
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value) {
    emailError.value = 'Veuillez entrer votre adresse email'
    return
  }

  if (!isValidEmail.value) {
    emailError.value = 'Format d\'email invalide'
    return
  }

  isLoading.value = true

  try {
    const { subscribeNewsletter } = useSecureApi()
    await subscribeNewsletter(email.value, 'coming-soon')

    successMessage.value = '✅ Merci ! Vous serez notifié du lancement.'
    email.value = ''
  } catch (error: any) {
    console.error('Erreur newsletter:', error)
    
    if (error.data?.message === 'Email already subscribed') {
      errorMessage.value = 'Cet email est déjà inscrit'
    } else if (error.data?.message === 'Invalid email format') {
      errorMessage.value = 'Format d\'email invalide'
    } else {
      errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.'
    }
  } finally {
    isLoading.value = false
  }
}

// SEO
useHead({
  title: 'Bientôt disponible - Geyavo',
  meta: [
    { 
      name: 'description', 
      content: 'Geyavo arrive bientôt ! La première plateforme de comparaison de transport en car et bus en Côte d\'Ivoire. Inscrivez-vous pour être notifié du lancement.' 
    },
    { name: 'robots', content: 'noindex, nofollow' },
    // Open Graph
    { property: 'og:title', content: 'Bientôt disponible - Geyavo' },
    { property: 'og:description', content: 'La première plateforme de comparaison de transport en car et bus en Côte d\'Ivoire arrive bientôt !' },
    { property: 'og:type', content: 'website' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Bientôt disponible - Geyavo' },
    { name: 'twitter:description', content: 'La première plateforme de comparaison de transport en car et bus en Côte d\'Ivoire arrive bientôt !' }
  ]
})
</script>
