<template>
  <div class="bg-corail-50 dark:bg-gray-800 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl text-primary-900 dark:text-white font-bold mb-4">{{ $t('home.newsletter.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">{{ $t('home.newsletter.subtitle') }}</p>
        
        <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input 
              v-model="email"
              type="email" 
              :placeholder="$t('home.newsletter.placeholder')" 
              :class="[
                'w-full px-4 py-3 rounded-xl border transition-colors',
                'focus:outline-none focus:ring-2 focus:border-transparent',
                'dark:bg-gray-700 dark:text-white',
                emailError 
                  ? 'border-corail-500 focus:ring-corail-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:ring-corail-500'
              ]"
              :disabled="isLoading"
              requicorail
            />
            
            <!-- Message d'erreur -->
            <div v-if="emailError" class="text-corail-500 text-sm mt-2 text-left">
              {{ emailError }}
            </div>
          </div>
          
          <div class="sm:self-start">
            <AppButton 
              type="submit"
              variant="corail" 
              :label="isLoading ? $t('home.newsletter.sending') : $t('home.newsletter.button')"
              :fullWidth="false"
              :disabled="isLoading || !isValidEmail"
            />
          </div>
        </form>

        <div v-if="successMessage" class="mt-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ successMessage }}
          </div>
        </div>

        <div v-if="errorMessage" class="mt-4 p-4 bg-corail-100 dark:bg-corail-900 text-corail-700 dark:text-corail-300 rounded-lg">
          <div class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// État réactif
const email = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const emailError = ref('')

const isValidEmail = computed(() => {
  if (!email.value) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

watch(email, (newEmail) => {
  emailError.value = ''
  errorMessage.value = ''
  
  if (newEmail && !isValidEmail.value) {
    emailError.value = $t('home.newsletter.invalidEmail')
  }
})

async function handleSubmit() {
  emailError.value = ''
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value) {
    emailError.value = $t('home.newsletter.emailRequicorail')
    return
  }

  if (!isValidEmail.value) {
    emailError.value = $t('home.newsletter.invalidEmail')
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/newsletter', {
      method: 'POST',
      body: {
        email: email.value,
        source: 'homepage'
      }
    })

    const subscribedEmail = email.value

    successMessage.value = $t('home.newsletter.success')
    
    await nextTick()
    email.value = ''
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_signup', {
        email: subscribedEmail
      })
    }


  } catch (error) {
    console.error('Erreur newsletter:', error)
    
    if (error.statusCode === 409) {
      errorMessage.value = $t('home.newsletter.alreadySubscribed')
    } else if (error.statusCode === 400) {
      errorMessage.value = $t('home.newsletter.invalidEmail')
    } else {
      errorMessage.value = $t('home.newsletter.error')
    }
  } finally {
    isLoading.value = false
  }
}
</script>