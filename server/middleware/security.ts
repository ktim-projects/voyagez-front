/**
 * 🛡️ MIDDLEWARE DE SÉCURITÉ - Geyavo API
 *
 * Modèle d'accès
 * --------------
 * Les routes /api/ servent d'abord le site lui-même. Elles étaient protégées
 * par une clé `x-api-key` que le navigateur devait présenter — donc exposée
 * dans le bundle client via runtimeConfig.public : n'importe qui pouvait la
 * lire et s'en servir. Une clé publique ne protège rien.
 *
 * Désormais :
 *   - les routes publiques acceptent les requêtes « first-party » (le site
 *     lui-même, y compris le rendu serveur) et refusent les requêtes
 *     navigateur cross-site ;
 *   - une clé valide reste acceptée pour les appels serveur à serveur ;
 *   - les routes privilégiées exigent toujours une clé admin, qui elle ne
 *     quitte jamais le serveur.
 *
 * ⚠️ Ce contrôle bloque l'usage cross-site depuis un navigateur, pas un
 * client HTTP quelconque : un script peut toujours omettre les en-têtes.
 * La vraie frontière sur les données est le RLS Supabase
 * (cf. supabase/migrations/enable_rls.sql) ; ce middleware limite l'abus
 * et le volume.
 */

import type { H3Event } from 'h3'
import { isFirstParty } from '../utils/first-party'

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

// 🔐 Clés acceptées pour les appels serveur à serveur.
// Elles ne sont lues que côté serveur et ne sont jamais envoyées au client.
const validApiKeys = new Set(
  [
    process.env.API_KEY_FRONTEND,
    process.env.API_KEY_ADMIN
  ].filter(Boolean)
)

// Routes exigeant une clé privilégiée, quelle que soit l'origine
const privilegedRoutes = ['/api/security/stats']

// Routes ouvertes sans aucun contrôle d'accès
const publicRoutes = ['/api/health', '/api/status']

// 📊 Statistiques globales
const securityStats = {
  totalRequests: 0,
  blockedRequests: 0,
  rateLimitHits: 0,
  injectionAttempts: 0,
  crossSiteRequests: 0,
  invalidApiKeys: 0
}

/**
 * Erreur de sécurité : createError() + un champ `type` exploitable par le
 * logger, sans avoir à caster l'erreur à chaque appel.
 */
type SecurityErrorType =
  | 'CROSS_SITE_REQUEST'
  | 'MISSING_API_KEY'
  | 'INVALID_API_KEY'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INJECTION_ATTEMPT'
  | 'INVALID_PARAMETER'
  | 'SECURITY_VIOLATION'

function securityError(statusCode: number, statusMessage: string, type: SecurityErrorType) {
  return Object.assign(createError({ statusCode, statusMessage }), { type })
}

/**
 * IP réelle du client.
 *
 * L'ancienne version lisait `socket.remoteAddress`, qui derrière le proxy
 * Vercel vaut l'adresse du proxy et non celle du visiteur : tous les
 * visiteurs partageaient alors le même compteur de rate limiting.
 */
function getClientIP(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  // Appliquer la sécurité uniquement aux routes API
  if (!url.pathname.startsWith('/api/')) {
    return
  }

  securityStats.totalRequests++
  const clientIP = getClientIP(event)

  try {
    // 🔐 1. CONTRÔLE D'ACCÈS
    checkAccess(event)

    // 🚫 2. RATE LIMITING
    checkRateLimit(clientIP)

    // 🔍 3. DÉTECTION D'INTRUSION
    checkForInjectionAttempts(event)

    // ✅ 4. VALIDATION DES PARAMÈTRES
    validateRequestParameters(event)

  } catch (error) {
    securityStats.blockedRequests++

    // Logger l'incident
    console.warn('🚨 SECURITY INCIDENT:', {
      type: (error as { type?: SecurityErrorType }).type || 'SECURITY_VIOLATION',
      ip: clientIP.substring(0, 8) + '***', // Masquer l'IP
      url: url.pathname,
      timestamp: new Date().toISOString()
    })

    throw error
  }
})

/**
 * Applique isFirstParty() aux en-têtes de la requête courante.
 */
function isFirstPartyRequest(event: H3Event): boolean {
  return isFirstParty(
    getHeader(event, 'sec-fetch-site'),
    getHeader(event, 'origin'),
    getRequestURL(event).host
  )
}

/**
 * 🔐 Contrôle d'accès
 */
function checkAccess(event: H3Event) {
  const url = getRequestURL(event)
  const apiKey = getHeader(event, 'x-api-key')

  if (publicRoutes.includes(url.pathname)) {
    return
  }

  // Routes privilégiées : clé admin obligatoire, jamais d'accès first-party
  if (privilegedRoutes.includes(url.pathname)) {
    const privilegedKeys = [process.env.API_KEY_ADMIN, process.env.API_KEY_STATS].filter(Boolean)

    if (!apiKey) {
      throw securityError(401, 'API Key required', 'MISSING_API_KEY')
    }
    if (!privilegedKeys.includes(apiKey)) {
      securityStats.invalidApiKeys++
      throw securityError(401, 'Invalid API Key', 'INVALID_API_KEY')
    }
    return
  }

  // Appel serveur à serveur muni d'une clé valide
  if (apiKey) {
    if (!validApiKeys.has(apiKey)) {
      securityStats.invalidApiKeys++
      throw securityError(401, 'Invalid API Key', 'INVALID_API_KEY')
    }
    return
  }

  // Sinon : seul le site lui-même est servi
  if (!isFirstPartyRequest(event)) {
    securityStats.crossSiteRequests++
    throw securityError(403, 'Cross-site request rejected', 'CROSS_SITE_REQUEST')
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
    pruneRateLimitCache(now)
    return
  }

  if (clientData.count >= maxRequests) {
    securityStats.rateLimitHits++
    throw securityError(429, 'Too Many Requests', 'RATE_LIMIT_EXCEEDED')
  }

  clientData.count++
}

/**
 * Le cache de rate limiting n'était jamais purgé : une entrée par IP y
 * restait indéfiniment. On nettoie les fenêtres expirées quand il grossit.
 */
function pruneRateLimitCache(now: number) {
  if (rateLimitCache.size < 10_000) return

  for (const [ip, data] of rateLimitCache) {
    if (now > data.resetTime) {
      rateLimitCache.delete(ip)
    }
  }
}

/**
 * 🔍 Détection des tentatives d'injection
 */
function checkForInjectionAttempts(event: H3Event) {
  const query = getQuery(event)
  const paramString = JSON.stringify(query).toLowerCase()

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(paramString)) {
      securityStats.injectionAttempts++
      throw securityError(400, 'Malicious request detected', 'INJECTION_ATTEMPT')
    }
  }
}

/**
 * ✅ Validation des paramètres de requête
 */
function validateRequestParameters(event: H3Event) {
  const query = getQuery(event)
  const url = getRequestURL(event)

  // Validation pour les routes de recherche
  if (url.pathname.includes('/search')) {
    // Valider from/to
    if (query.from && typeof query.from === 'string') {
      if (query.from.length > 100 || !/^[a-zA-ZÀ-ÿ\s-]+$/.test(query.from)) {
        throw securityError(400, 'Invalid from parameter', 'INVALID_PARAMETER')
      }
    }

    if (query.to && typeof query.to === 'string') {
      if (query.to.length > 100 || !/^[a-zA-ZÀ-ÿ\s-]+$/.test(query.to)) {
        throw securityError(400, 'Invalid to parameter', 'INVALID_PARAMETER')
      }
    }

    // Valider les paramètres numériques
    if (query.page && (isNaN(Number(query.page)) || Number(query.page) < 1 || Number(query.page) > 1000)) {
      throw securityError(400, 'Invalid page parameter', 'INVALID_PARAMETER')
    }

    if (query.limit && (isNaN(Number(query.limit)) || Number(query.limit) < 1 || Number(query.limit) > 25)) {
      throw securityError(400, 'Invalid limit parameter', 'INVALID_PARAMETER')
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
