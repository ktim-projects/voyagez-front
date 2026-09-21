export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  
  // Vérifier si le mode "coming soon" est activé
  const isComingSoonMode = config.public.comingSoonMode === 'true'
  
  // Si le mode n'est pas activé, ne rien faire
  if (!isComingSoonMode) {
    return
  }
  
  // Liste des IPs autorisées (développeurs/admins) - trim pour enlever les espaces
  const allowedIPsString = String(config.public.comingSoonAllowedIPs || '')
  const allowedIPs = allowedIPsString
    .split(',')
    .map(ip => ip.trim())
    .filter(Boolean)
  
  // Vérifier l'IP du client (côté serveur uniquement)
  if (import.meta.server) {
    const event = useRequestEvent()
    
    // Récupérer l'IP du client (peut contenir plusieurs IPs séparées par des virgules)
    let clientIP = (event?.node.req.headers['x-forwarded-for'] || 
                    event?.node.req.headers['x-real-ip'] || 
                    event?.node.req.socket.remoteAddress) as string
    
    // Si x-forwarded-for contient plusieurs IPs, prendre la première
    if (clientIP && clientIP.includes(',')) {
      clientIP = clientIP.split(',')[0]?.trim() ?? clientIP
    }
    
    // Nettoyer l'IP (enlever le port si présent, ex: ::1:12345 -> ::1)
    if (clientIP) {
      clientIP = clientIP.replace(/:\d+$/, '').trim()
    }
    
    // Vérifier si l'IP est autorisée
    const isIPAllowed = !!(clientIP && allowedIPs.includes(clientIP))
    
    if (isIPAllowed) {
      // Si on est sur /coming-soon, rediriger vers la home
      if (to.path === '/coming-soon') {
        return navigateTo('/')
      }
      
      // Sinon, laisser accéder normalement (ne rien faire)
      return
    }
    
    // IP non autorisée : rediriger si on n'est pas déjà sur /coming-soon
    if (to.path !== '/coming-soon') {
      return navigateTo('/coming-soon')
    }
  }
})
