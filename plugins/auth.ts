export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  
  // Check authentication status on app start
  await authStore.checkAuth();
});