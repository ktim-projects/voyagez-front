import { serverSupabaseClient } from '#supabase/server'
import { createError } from 'h3'

// Cache simple en mémoire (pour demo - en prod utiliser Redis)
const companyCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getCachedCompanies(client: any, operatorIds: string[]) {
  const now = Date.now()
  const uncachedIds: string[] = []
  const cachedCompanies: any[] = []
  
  // Vérifier le cache
  for (const id of operatorIds) {
    const cached = companyCache.get(id)
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      cachedCompanies.push(cached.data)
    } else {
      uncachedIds.push(id)
    }
  }
  
  // Récupérer les données manquantes
  if (uncachedIds.length > 0) {
    const { data: freshCompanies } = await client
      .from('company')
      .select('id, name, logo_url')
      .in('id', uncachedIds)
    
    // Mettre en cache
    freshCompanies?.forEach((company: any) => {
      companyCache.set(company.id, {
        data: company,
        timestamp: now
      })
      cachedCompanies.push(company)
    })
  }
  
  return cachedCompanies
}

export default defineEventHandler(async (event) => {
  // ... même logique que search.get.ts ...
  
  const client = await serverSupabaseClient(event)
  
  // Récupération avec cache
  const { data: departures, error, count } = await client
    .from('departure')
    .select('*', { count: 'exact' })
    .eq('origin', 'test')
    .eq('destination', 'test')
    .limit(5)

  if (error) {
    throw createError({ statusMessage: error.message })
  }
  
  // 🚀 Utilisation du cache
  let enrichedDepartures: any = departures
  if (departures && departures.length > 0) {
    const operatorIds = [...new Set((departures as any[]).map((d: any) => d.operator).filter(Boolean))]
    
    if (operatorIds.length > 0) {
      const companies = await getCachedCompanies(client, operatorIds)
      const companyMap = new Map(companies.map((c: any) => [c.id, c]))
      
      enrichedDepartures = (departures as any[]).map((departure: any) => ({
        ...departure,
        company: companyMap.get(departure.operator) || null
      }))
    }
  }
  
  return {
    departures: enrichedDepartures,
    total: count,
    totalPages: Math.ceil((count || 0) / 5),
    cacheStats: {
      cacheSize: companyCache.size,
      message: "Cache actif pour optimiser les performances"
    }
  }
});
