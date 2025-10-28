import { serverSupabaseClient } from '#supabase/server'
import { createError } from 'h3'
import { COMMUNE_QUARTIERS, type CommuneAbidjan } from '~/utils/communes'

// 🚀 Cache for companies
const companyCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

// 🎯 Cache for queries (optional)
const queryCache = new Map<string, { data: any; timestamp: number }>()
const QUERY_CACHE_TTL = 2 * 60 * 1000 // 2 minutes

async function getCachedCompanies(client: any, operatorIds: string[]) {
  const now = Date.now()
  const uncachedIds: string[] = []
  const cachedCompanies: any[] = []
  
  // Verify cache
  for (const id of operatorIds) {
    const cached = companyCache.get(id)
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      cachedCompanies.push(cached.data)
    } else {
      uncachedIds.push(id)
    }
  }
  
  // Get missing data
  if (uncachedIds.length > 0) {
    const { data: freshCompanies } = await client
      .from('company')
      .select('id, name, logo_url')
      .in('id', uncachedIds)
    
    // Add to cache
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
    comfortCategories: params.comfortCategories,
    commune: params.commune,
    sort: params.sort
  })
}

export default defineEventHandler(async (event) => {
  const queryFromApp = getQuery(event);
  const { 
    from, 
    to, 
    page = 1,
    limit = 25, // Pagination optimized
    maxPrice,
    companies,
    departurePeriod,
    comfortCategories,
    commune,
    sort = 'departure_time'
  } = queryFromApp; 
  
  if (!from || !to) {
    throw createError({
      statusCode: 400,
      message: 'Les paramètres de départ et d\'arrivée sont requis'
    });
  }

  // 🚀 Verify query cache
  const cacheKey = generateCacheKey(queryFromApp)
  const now = Date.now()
  const cachedQuery = queryCache.get(cacheKey)
  
  if (cachedQuery && (now - cachedQuery.timestamp) < QUERY_CACHE_TTL) {
    console.info('Cache infos:', {
      cacheHit: true,
      cacheAge: Math.round((now - cachedQuery.timestamp) / 1000)
    })
    
    return {
      ...cachedQuery.data,
    }
  }

  const client = await serverSupabaseClient(event)
  
  // 🎯 Pagination DB
  const pageNum = Math.max(1, Number(page))
  const limitNum = Math.min(25, Math.max(1, Number(limit))) // Limit max 25
  const offset = (pageNum - 1) * limitNum
  
  // 🚀 Optimized query with JOIN (if data is correct)
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
      comfort_info,
      contacts,
      company:operator (
        id,
        name,
        logo_url
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

  if (comfortCategories) {
    const categoryList = Array.isArray(comfortCategories) ? comfortCategories : [comfortCategories]
    if (categoryList.length > 0) {
      // Filtrer par catégorie de confort en utilisant l'opérateur JSONB
      const categoryFilters = categoryList.map(category => `comfort_info->>category.eq.${category}`).join(',')
      query = query.or(categoryFilters)
    }
  }

  // Filtre de commune avec matching sur les quartiers
  if (commune) {
    const quartiers = COMMUNE_QUARTIERS[commune as CommuneAbidjan]
    
    if (quartiers && quartiers.length > 0) {
      // Créer un filtre OR pour chaque quartier de la commune
      // On recherche à la fois avec et sans accents pour maximiser les résultats
      const quartierFilters = quartiers
        .flatMap(quartier => {
          // Version originale (avec accents potentiels)
          const original = `station.ilike.%${quartier}%`
          
          // Version normalisée (sans accents)
          const normalized = quartier
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
          const normalizedFilter = `station.ilike.%${normalized}%`
          
          // Retourner les deux versions si elles sont différentes
          return original !== normalizedFilter ? [original, normalizedFilter] : [original]
        })
        .join(',')
      
      // Appliquer le filtre OR sur tous les quartiers
      query = query.or(quartierFilters)
    }
  }
  
  // 🎯 Pagination DB
  query = query.range(offset, offset + limitNum - 1);

  // 📈 Sort
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
    // If JOIN fails, fallback to separate queries
    console.warn('JOIN failed, falling back to separate queries:', error.message)
    
    let fallbackQuery = client
      .from('departure')
      .select('*, comfort_info, contacts', { count: 'exact' })
      .eq('origin', from)
      .eq('destination', to)

    // Apply same filters as main query
    if (maxPrice) {
      fallbackQuery = fallbackQuery.lte('price', Number(maxPrice))
    }

    if (companies) {
      const companyList = Array.isArray(companies) ? companies : [companies]
      fallbackQuery = fallbackQuery.in('operator', companyList)
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
        fallbackQuery = fallbackQuery
          .gte('departure_time', range.start)
          .lte('departure_time', range.end);
      }
    }

    if (comfortCategories) {
      const categoryList = Array.isArray(comfortCategories) ? comfortCategories : [comfortCategories]
      if (categoryList.length > 0) {
        const categoryFilters = categoryList.map(category => `comfort_info->>category.eq.${category}`).join(',')
        fallbackQuery = fallbackQuery.or(categoryFilters)
      }
    }

    // Filtre de commune avec matching sur les quartiers
    if (commune) {
      const quartiers = COMMUNE_QUARTIERS[commune as CommuneAbidjan]
      
      if (quartiers && quartiers.length > 0) {
        const quartierFilters = quartiers
          .map(quartier => {
            const normalized = quartier
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
            
            return `station.ilike.%${normalized}%`
          })
          .join(',')
        
        fallbackQuery = fallbackQuery.or(quartierFilters)
      }
    }

    const { data: fallbackDepartures, error: fallbackError, count: fallbackCount } = await fallbackQuery
      .range(offset, offset + limitNum - 1)
      .order('departure_time', { ascending: true })
    
    if (fallbackError) {
      throw createError({ statusMessage: fallbackError.message })
    }
    
    // Enrich with companies
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
      _meta: {
        total: fallbackCount || 0,
        limit: limitNum,
        offset,
      },
    }

    console.info('Performance:',  {
      method: 'fallback_with_cache',
      cacheHits: companyCache.size,
      queryTime: 'optimized'
    })
    
    // Add to cache
    queryCache.set(cacheKey, { data: result, timestamp: now })
    
    return result
  }

  console.log('join');
  
  // ✅ Success with JOIN
  const result = {
    departures,
    _meta: {
      total: count || 0,
      limit: limitNum,
      offset,
      
    },
  }

  console.info('Performance:', {
    method: 'optimized_join',
    cacheHits: companyCache.size,
    queryTime: 'fast'
  })
  
  // Add to cache
  queryCache.set(cacheKey, { data: result, timestamp: now })
  
  return result
});
