<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('contact.title') }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ $t('contact.subtitle') }}
        </p>
      </div>

      <!-- Formulaire de contact -->
      <div class="rounded-2xl p-8 bg-white dark:bg-gray-800 shadow-md">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nom -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('contact.form.fullName') }}</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              :placeholder="$t('contact.form.fullNamePlaceholder')"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('contact.form.email') }}</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              :placeholder="$t('contact.form.emailPlaceholder')"
            />
          </div>

          <!-- Sujet -->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('contact.form.subject') }}</label>
            <select
              id="subject"
              v-model="formData.subject"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{{ $t('contact.form.subjectPlaceholder') }}</option>
              <option value="general">{{ $t('contact.form.subjectOptions.general') }}</option>
              <option value="support">{{ $t('contact.form.subjectOptions.support') }}</option>
              <option value="partnership">{{ $t('contact.form.subjectOptions.partnership') }}</option>
              <option value="other">{{ $t('contact.form.subjectOptions.other') }}</option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('contact.form.message') }}</label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="4"
              required
              class="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              :placeholder="$t('contact.form.messagePlaceholder')"
            ></textarea>
          </div>

          <!-- Messages d'erreur/succès -->
          <div v-if="successMessage" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p class="text-green-800 dark:text-green-200">{{ successMessage }}</p>
          </div>
          
          <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-red-800 dark:text-red-200">{{ errorMessage }}</p>
          </div>

          <!-- Bouton d'envoi -->
          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('contact.form.sending') }}
              </span>
              <span v-else>{{ $t('contact.form.send') }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Informations de contact -->
      <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <PhoneIcon class="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ $t('contact.contactInfo.phone.title') }}</h3>
            <p class="mt-1 text-gray-600 dark:text-gray-400">{{ $t('contact.contactInfo.phone.hours') }}</p>
            <a :href="'tel:' + $t('contact.contactInfo.phone.number')" class="mt-1 block text-primary-600 dark:text-corail-400 hover:text-corail-500">
              {{ $t('contact.contactInfo.phone.number') }}
            </a>
          </div>
        </div>

        <div class="flex items-center">
          <div class="flex-shrink-0">
            <MailIcon class="h-6 w-6 text-primary-600 dark:text-corail-400" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ $t('contact.contactInfo.email.title') }}</h3>
            <p class="mt-1 text-gray-600 dark:text-gray-400">{{ $t('contact.contactInfo.email.response') }}</p>
            <a :href="'mailto:contact@geyavo.com'" class="mt-1 block text-primary-600 dark:text-corail-400 hover:text-corail-500">
              contact@geyavo.com
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
const successMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    const { sendContactMessage } = useSecureApi()
    await sendContactMessage(formData.value)
    
    successMessage.value = '✅ Message envoyé avec succès! Nous vous répondrons au plus vite.'
    
    // Réinitialiser le formulaire
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error: any) {
    console.error('Contact error:', error)
    
    if (error.statusCode === 409 || error.data?.message?.includes('You already have a pending message.')) {
      errorMessage.value = '⚠️ Vous avez déjà un message en attente. Veuillez attendre notre réponse avant d\'envoyer un nouveau message.'

    }else if (error.statusCode === 400 && error.data?.message?.includes("Invalid email format")) {
      errorMessage.value = '❌ Veuillez entrer une adresse email valide.'
    } else if (error.statusCode === 400 && error.data?.message?.includes('required')) {
      errorMessage.value = '❌ Veuillez remplir tous les champs obligatoires.'
    } else {
      errorMessage.value = '❌ Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
