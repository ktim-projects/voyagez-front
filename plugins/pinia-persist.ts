import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }) => {
  // Le plugin de persistance utilise localStorage, donc uniquement côté client
  if (process.client) {
    $pinia.use(piniaPluginPersistedstate)
  }
})
