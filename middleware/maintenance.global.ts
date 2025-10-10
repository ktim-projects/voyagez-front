export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  
  // Vérifier si le mode maintenance est activé
  const isMaintenanceMode = config.public.maintenanceMode === 'true'
  
  // Liste des IPs autorisées (développeurs/admins)
  const allowedIPsString = String(config.public.maintenanceAllowedIPs || '')
  const allowedIPs = allowedIPsString.split(',').filter(Boolean)
  
  // Ne pas rediriger si on est déjà sur la page de maintenance
  if (to.path === '/maintenance') {
    // Si le mode maintenance est désactivé, rediriger vers l'accueil
    if (!isMaintenanceMode) {
      return navigateTo('/')
    }
    return
  }
  
  // Si le mode maintenance est activé
  if (isMaintenanceMode) {
    // Vérifier l'IP du client (côté serveur uniquement)
    if (process.server) {
      const event = useRequestEvent()
      const clientIP = event?.node.req.headers['x-forwarded-for'] || 
                       event?.node.req.headers['x-real-ip'] || 
                       event?.node.req.socket.remoteAddress
      
      // Si l'IP est dans la liste autorisée, laisser passer
      if (clientIP && allowedIPs.includes(clientIP as string)) {
        return
      }
    }
    
    // Rediriger vers la page de maintenance
    return navigateTo('/maintenance')
  }
})
