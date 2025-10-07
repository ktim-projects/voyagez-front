/**
 * 🛡️ MIDDLEWARE DE SÉCURITÉ - Geyavo API
 * Version simplifiée et fonctionnelle
 */

// Cache simple pour le rate limiting
const rateLimitCache = new Map<string, { count: number; resetTime: number }>()

// 🔍 Patterns malicieux à détecter
const suspiciousPatterns = [
  /drop\s+table/i,
  /union\s+select/i,
  /<script/i,
  /\.\.\//,
  /[;&|`]/
]

// 🔐 API Keys valides depuis les variables d'environnement
const validApiKeys = new Set([
  process.env.API_KEY_FRONTEND,
  process.env.API_KEY_ADMIN
].filter(Boolean)) // Filtrer les valeurs undefined

// 📊 Statistiques globales
const securityStats = {
  totalRequests: 0,
  blockedRequests: 0,
  rateLimitHits: 0,
  injectionAttempts: 0,
  invalidApiKeys: 0
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Appliquer la sécurité uniquement aux routes API
  if (!url.pathname.startsWith('/api/')) {
    return
  }

  securityStats.totalRequests++
  const clientIP = event.node.req.socket.remoteAddress || 'unknown'
  
  try {
    // 🔐 1. AUTHENTIFICATION API
    checkApiAuthentication(event)
    
    // 🚫 2. RATE LIMITING
    checkRateLimit(clientIP)
    
    // 🔍 3. DÉTECTION D'INTRUSION
    await checkForInjectionAttempts(event)
    
    // ✅ 4. VALIDATION DES PARAMÈTRES
    validateRequestParameters(event)
    
  } catch (error: any) {
    securityStats.blockedRequests++
    
    // Logger l'incident
    console.warn('🚨 SECURITY INCIDENT:', {
      type: error.type || 'SECURITY_VIOLATION',
      ip: clientIP.substring(0, 8) + '***', // Masquer l'IP
      url: url.pathname,
      timestamp: new Date().toISOString()
    })
    
    throw error
  }
})

/**
 * 🔐 Vérification de l'authentification API
 */
function checkApiAuthentication(event: any) {
  const apiKey = getHeader(event, 'x-api-key')
  const url = getRequestURL(event)
  
  // Routes publiques (optionnel)
  const publicRoutes = ['/api/health', '/api/status']
  if (publicRoutes.includes(url.pathname)) {
    return
  }
  
  // Route admin avec clé spéciale (admin ou stats)
  if (url.pathname === '/api/security/stats') {
    const validStatsKeys = [process.env.API_KEY_ADMIN, process.env.API_KEY_STATS].filter(Boolean)
    if (validStatsKeys.includes(apiKey)) {
      return
    }
  }
  
  if (!apiKey) {
    const error = createError({
      statusCode: 401,
      statusMessage: 'API Key required'
    })
    ;(error as any).type = 'MISSING_API_KEY'
    throw error
  }
  
  if (!validApiKeys.has(apiKey)) {
    securityStats.invalidApiKeys++
    const error = createError({
      statusCode: 401,
      statusMessage: 'Invalid API Key'
    })
    ;(error as any).type = 'INVALID_API_KEY'
    throw error
  }
}

/**
 * 🚫 Vérification du rate limiting
 */
function checkRateLimit(clientIP: string) {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  
  // Configuration adaptative selon l'environnement
  const isDev = process.env.NODE_ENV === 'development'
  const isTest = process.env.DISABLE_RATE_LIMIT === 'true'
  
  // Si les tests sont en cours, désactiver le rate limiting
  if (isTest) return
  
  const maxRequests = isDev ? 200 : 30 // Dev: 200 req/min, Prod: 30 req/min
  
  const clientData = rateLimitCache.get(clientIP)
  
  if (!clientData || now > clientData.resetTime) {
    // Nouveau client ou fenêtre expirée
    rateLimitCache.set(clientIP, {
      count: 1,
      resetTime: now + windowMs
    })
    return
  }
  
  if (clientData.count >= maxRequests) {
    securityStats.rateLimitHits++
    const error = createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests'
    })
    ;(error as any).type = 'RATE_LIMIT_EXCEEDED'
    throw error
  }
  
  clientData.count++
}

/**
 * 🔍 Détection des tentatives d'injection
 */
async function checkForInjectionAttempts(event: any) {
  const query = getQuery(event)
  const paramString = JSON.stringify(query).toLowerCase()
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(paramString)) {
      securityStats.injectionAttempts++
      const error = createError({
        statusCode: 400,
        statusMessage: 'Malicious request detected'
      })
      ;(error as any).type = 'INJECTION_ATTEMPT'
      throw error
    }
  }
}

/**
 * ✅ Validation des paramètres de requête
 */
function validateRequestParameters(event: any) {
  const query = getQuery(event)
  const url = getRequestURL(event)
  
  // Validation pour les routes de recherche
  if (url.pathname.includes('/search')) {
    // Valider from/to
    if (query.from && typeof query.from === 'string') {
      if (query.from.length > 100 || !/^[a-zA-ZÀ-ÿ\s-]+$/.test(query.from)) {
        const error = createError({
          statusCode: 400,
          statusMessage: 'Invalid from parameter'
        })
        ;(error as any).type = 'INVALID_PARAMETER'
        throw error
      }
    }
    
    if (query.to && typeof query.to === 'string') {
      if (query.to.length > 100 || !/^[a-zA-ZÀ-ÿ\s-]+$/.test(query.to)) {
        const error = createError({
          statusCode: 400,
          statusMessage: 'Invalid to parameter'
        })
        ;(error as any).type = 'INVALID_PARAMETER'
        throw error
      }
    }
    
    // Valider les paramètres numériques
    if (query.page && (isNaN(Number(query.page)) || Number(query.page) < 1 || Number(query.page) > 1000)) {
      const error = createError({
        statusCode: 400,
        statusMessage: 'Invalid page parameter'
      })
      ;(error as any).type = 'INVALID_PARAMETER'
      throw error
    }
    
    if (query.limit && (isNaN(Number(query.limit)) || Number(query.limit) < 1 || Number(query.limit) > 25)) {
      const error = createError({
        statusCode: 400,
        statusMessage: 'Invalid limit parameter'
      })
      ;(error as any).type = 'INVALID_PARAMETER'
      throw error
    }
  }
}

/**
 * 📊 Obtenir les statistiques de sécurité
 */
export function getSecurityStats() {
  return {
    ...securityStats,
    rateLimitCacheSize: rateLimitCache.size,
    timestamp: new Date().toISOString()
  }
}
