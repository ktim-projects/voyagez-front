<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
        <p class="text-lg text-gray-600">
          Une question ? Un retour ? N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais.
        </p>
      </div>

      <!-- Formulaire de contact -->
      <div class="rounded-2xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nom -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nom complet</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Votre nom"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="vous@exemple.com"
            />
          </div>

          <!-- Sujet -->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700">Sujet</label>
            <select
              id="subject"
              v-model="formData.subject"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Sélectionnez un sujet</option>
              <option value="general">Question générale</option>
              <option value="support">Support technique</option>
              <option value="partnership">Partenariat</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="4"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Votre message..."
            ></textarea>
          </div>

          <!-- Bouton d'envoi -->
          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
              <span v-else>Envoyer le message</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Informations de contact -->
      <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <PhoneIcon class="h-6 w-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Support téléphonique</h3>
            <p class="mt-1 text-gray-600">Du lundi au vendredi, 9h-18h</p>
            <a href="tel:+33123456789" class="mt-1 block text-primary-600 hover:text-primary-500">
              +33 1 23 45 67 89
            </a>
          </div>
        </div>

        <div class="flex items-center">
          <div class="flex-shrink-0">
            <MailIcon class="h-6 w-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Email</h3>
            <p class="mt-1 text-gray-600">Notre équipe vous répond sous 24h</p>
            <a href="mailto:contact@voyagez.fr" class="mt-1 block text-primary-600 hover:text-primary-500">
              contact@voyagez.fr
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PhoneIcon, MailIcon } from 'lucide-vue-next'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Réinitialiser le formulaire
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    
    // Afficher un message de succès
    alert('Votre message a été envoyé avec succès !')
  } catch (error) {
    alert('Une erreur est survenue lors de l\'envoi du message.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
