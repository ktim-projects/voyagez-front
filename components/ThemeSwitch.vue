<template>
  <button 
    @click="toggleTheme" 
    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    :title="$t(isDark ? 'common.lightMode' : 'common.darkMode')"
    aria-label="Toggle theme"
  >
    <Moon v-if="isDark" class="h-5 w-5 text-gray-600 dark:text-gray-300" />
    <SunMoon v-else class="h-5 w-5 text-gray-600 dark:text-gray-300" />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Moon, SunMoon } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isDark = ref(false);

// Fonction pour basculer entre les thèmes
const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

// Fonction pour mettre à jour le thème
const updateTheme = () => {
  // Vérifier qu'on est côté client
  if (!process.client) return;
  
  // Mettre à jour les classes sur le document
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

// Initialiser le thème au chargement du composant
onMounted(() => {
  // Vérifier la préférence stockée
  const savedTheme = localStorage.getItem('theme');
  
  // Par défaut, utiliser le thème clair
  isDark.value = savedTheme === 'dark';
  
  // Appliquer le thème
  updateTheme();
  
  // Écouter les changements de préférence système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === null) {
      isDark.value = e.matches;
      updateTheme();
    }
  });
});
</script>
