import { serverSupabaseClient } from '#supabase/server'
import { createError } from 'h3'

// 🚀 Cache en mémoire pour les compagnies
const companyCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

// 🎯 Cache pour les requêtes complètes (optionnel)
const queryCache = new Map<string, { data: any; timestamp: number }>()
const QUERY_CACHE_TTL = 2 * 60 * 1000 // 2 minutes

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
      .select('id, name, logo_url, contact, email')
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

function generateCacheKey(params: any): string {
  return JSON.stringify({
    from: params.from,
    to: params.to,
    page: params.page,
    limit: params.limit,
    maxPrice: params.maxPrice,
    companies: params.companies,
    departurePeriod: params.departurePeriod,
    sort: params.sort
  })
}

export default defineEventHandler(async (event) => {
  const queryFromApp = getQuery(event);
  const { 
    from, 
    to, 
    page = 1,
    limit = 25, // Pagination optimisée
    maxPrice,
    companies,
    departurePeriod,
    sort = 'departure_time'
  } = queryFromApp; 
  
  if (!from || !to) {
    throw createError({
      statusCode: 400,
      message: 'Les paramètres de départ et d\'arrivée sont requis'
    });
  }

  // 🚀 Vérifier le cache de requête
  const cacheKey = generateCacheKey(queryFromApp)
  const now = Date.now()
  const cachedQuery = queryCache.get(cacheKey)
  
  if (cachedQuery && (now - cachedQuery.timestamp) < QUERY_CACHE_TTL) {
    return {
      ...cachedQuery.data,
      cached: true,
      cacheAge: Math.round((now - cachedQuery.timestamp) / 1000)
    }
  }

  const client = await serverSupabaseClient(event)
  
  // 🎯 PAGINATION CÔTÉ DB - Calcul optimisé
  const pageNum = Math.max(1, Number(page))
  const limitNum = Math.min(100, Math.max(1, Number(limit))) // Limite max 100
  const offset = (pageNum - 1) * limitNum
  
  // 🚀 REQUÊTE OPTIMISÉE avec JOIN (si les données sont corrigées)
  let query = client
    .from('departure')
    .select(`
      id,
      operator,
      origin,
      destination,
      departure_time,
      arrival_time,
      duration,
      price,
      date,
      station,
      company:operator (
        id,
        name,
        logo_url,
        contact,
        email,
        services
      )
    `, { count: 'exact' })
    .eq('origin', from)
    .eq('destination', to)
    
  // 📊 Filtres optimisés
  if (maxPrice) {
    query = query.lte('price', Number(maxPrice))
  }

  if (companies) {
    const companyList = Array.isArray(companies) ? companies : [companies]
    query = query.in('operator', companyList)
  }

  if (departurePeriod) {
    const timeRanges = {
      morning: { start: '06:00', end: '11:59' },
      afternoon: { start: '12:00', end: '17:59' },
      evening: { start: '18:00', end: '23:59' },
      night: { start: '00:00', end: '05:59' }
    };

    const range = timeRanges[departurePeriod as keyof typeof timeRanges];
    if (range) {
      query = query
        .gte('departure_time', range.start)
        .lte('departure_time', range.end);
    }
  }
  
  // 🎯 PAGINATION CÔTÉ DB
  query = query.range(offset, offset + limitNum - 1);

  // 📈 Tri optimisé
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true }).order('departure_time', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false }).order('departure_time', { ascending: true });
      break;
    case 'duration_asc':
      query = query.order('duration', { ascending: true });
      break;
    default:
      query = query.order('departure_time', { ascending: true });
  }

  const { data: departures, error, count } = await query

  if (error) {
    // Si le JOIN échoue, fallback vers l'approche séparée
    console.warn('JOIN failed, falling back to separate queries:', error.message)
    
    const { data: fallbackDepartures, error: fallbackError, count: fallbackCount } = await client
      .from('departure')
      .select('*', { count: 'exact' })
      .eq('origin', from)
      .eq('destination', to)
      .range(offset, offset + limitNum - 1)
      .order('departure_time', { ascending: true })
    
    if (fallbackError) {
      throw createError({ statusMessage: fallbackError.message })
    }
    
    // Enrichir avec le cache
    let enrichedDepartures: any = fallbackDepartures
    if (fallbackDepartures && fallbackDepartures.length > 0) {
      const operatorIds = [...new Set((fallbackDepartures as any[]).map((d: any) => d.operator).filter(Boolean))]
      
      if (operatorIds.length > 0) {
        const companies = await getCachedCompanies(client, operatorIds)
        const companyMap = new Map(companies.map((c: any) => [c.id, c]))
        
        enrichedDepartures = (fallbackDepartures as any[]).map((departure: any) => ({
          ...departure,
          company: companyMap.get(departure.operator) || null
        }))
      }
    }
    
    const result = {
      departures: enrichedDepartures,
      total: fallbackCount || 0,
      totalPages: Math.ceil((fallbackCount || 0) / limitNum),
      currentPage: pageNum,
      limit: limitNum,
      hasNextPage: (fallbackCount || 0) > offset + limitNum,
      hasPreviousPage: pageNum > 1,
      performance: {
        method: 'fallback_with_cache',
        cacheHits: companyCache.size,
        queryTime: 'optimized'
      }
    }
    
    // Mettre en cache le résultat
    queryCache.set(cacheKey, { data: result, timestamp: now })
    
    return result
  }
  
  // ✅ Succès avec JOIN
  const result = {
    departures,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limitNum),
    currentPage: pageNum,
    limit: limitNum,
    hasNextPage: (count || 0) > offset + limitNum,
    hasPreviousPage: pageNum > 1,
    performance: {
      method: 'optimized_join',
      cacheHits: companyCache.size,
      queryTime: 'fast'
    }
  }
  
  // Mettre en cache le résultat
  queryCache.set(cacheKey, { data: result, timestamp: now })
  
  return result
});
