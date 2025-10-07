/**
 * 📊 ENDPOINT DE STATISTIQUES DE SÉCURITÉ
 * Accessible uniquement avec une clé API admin
 */

import { getSecurityStats } from '../../middleware/01.security'

export default defineEventHandler(async (event) => {
  const apiKey = getHeader(event, 'x-api-key')
  
  // Vérifier que c'est une clé admin ou stats
  const validStatsKeys = [process.env.API_KEY_ADMIN, process.env.API_KEY_STATS].filter(Boolean)
  if (!validStatsKeys.includes(apiKey)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }
  
  return {
    status: 'success',
    data: getSecurityStats(),
    message: 'Security statistics retrieved successfully'
  }
})
