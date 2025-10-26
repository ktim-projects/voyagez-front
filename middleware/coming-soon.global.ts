export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  
  // Vérifier si le mode "coming soon" est activé
  const isComingSoonMode = config.public.comingSoonMode === 'true'
  
  // Liste des IPs autorisées (développeurs/admins)
  const allowedIPsString = String(config.public.comingSoonAllowedIPs || '')
  const allowedIPs = allowedIPsString.split(',').filter(Boolean)
  
  // Ne pas rediriger si on est déjà sur la page coming-soon
  if (to.path === '/coming-soon') {
    // Si le mode coming-soon est désactivé, rediriger vers l'accueil
    if (!isComingSoonMode) {
      return navigateTo('/')
    }
    return
  }
  
  // Si le mode coming-soon est activé
  if (isComingSoonMode) {
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
    
    // Rediriger vers la page coming-soon
    return navigateTo('/coming-soon')
  }
})
