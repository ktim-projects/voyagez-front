<template>
  <div class="relative inline-block text-left">
    <button 
      @click="isOpen = !isOpen" 
      type="button" 
      class="inline-flex items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      {{ currentLocale.name }}
      <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <div 
      v-if="isOpen" 
      class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu" 
      aria-orientation="vertical" 
      aria-labelledby="menu-button" 
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <button 
          v-for="locale in availableLocales" 
          :key="locale.code"
          @click="switchLanguage(locale.code)"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" 
          role="menuitem" 
          tabindex="-1"
        >
          {{ locale.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const isOpen = ref(false)
const { locale, locales } = useI18n()

const availableLocales = computed(() => {
  return locales.value.map(l => ({
    code: l.code,
    name: l.name
  }))
})

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value) || { code: 'fr', name: 'Français' }
})

const switchLanguage = (code) => {
  locale.value = code
  isOpen.value = false
}

// Fermer le menu lorsqu'on clique en dehors
const closeOnClickOutside = (event) => {
  if (isOpen.value && !event.target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>
