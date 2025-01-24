import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(piniaPluginPersistedstate)
})
