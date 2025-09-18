import { serverSupabaseClient } from '#supabase/server'
import { createError } from 'h3'
import { normalizeCity } from '~/utils/string';

// defineCachedEventHandler
export default defineEventHandler(async (event) => {
  const queryFromApp = getQuery(event);
  const { 
    from, 
    to, 
    page = 1,
    limit = 3,
    maxPrice,
    companies,
    departurePeriod,
    sort = 'departure_time'
  } = queryFromApp; 
  
  const offset: number = (Number(page) - 1) * Number(limit);

  if (!from || !to) {
    throw createError({
      statusCode: 400,
      message: 'Les paramètres de départ et d\'arrivée sont requis'
    });
  }

  const client = await serverSupabaseClient(event)
  
  let query = client
    .from('departure')
    .select(`
      *
    `, { count: 'exact' })
    .eq('origin', from)
    .eq('destination', to)
    
  // Apply price filter if maxPrice is provided
  if (maxPrice) {
    query = query.lte('price', Number(maxPrice))
  }

  // Apply companies filter if provided
  console.log('companies', companies);
  console.log('Array.isArray(companies)', Array.isArray(companies));
  
  if (companies) {
    query = query.in('operator', Array.isArray(companies) ? companies : [companies])
  }

  // Apply departure period filter
  if (departurePeriod) {
    const timeRanges = {
      morning: { start: '05:00', end: '11:59' },
      afternoon: { start: '12:00', end: '17:59' },
      evening: { start: '18:00', end: '23:59' }
    };

    const range = timeRanges[departurePeriod as keyof typeof timeRanges];
    if (range) {
      query = query
        .gte('departure_time', range.start)
        .lte('departure_time', range.end);
    }
  }
  query = query
    .range(offset, offset + Number(limit) - 1);

  // ordering
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true }).order('departure_time', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false }).order('departure_time', { ascending: true });
      break;
    default:
      query = query.order('departure_time', { ascending: true });
  }
  

  const { data: departures, error, count } = await query

  if (error) {
    throw createError({ statusMessage: error.message })
  }
  
  // 🚀 OPTIMISATION : Récupérer les compagnies en parallèle si nécessaire
  let enrichedDepartures: any = departures
  if (departures && departures.length > 0) {
    const operatorIds = [...new Set((departures as any[]).map((d: any) => d.operator).filter(Boolean))]
    
    if (operatorIds.length > 0) {
      // ⚡ Requête optimisée avec sélection minimale
      const { data: companies } = await client
        .from('company')
        .select('id, name, logo_url') // Seulement les champs essentiels
        .in('id', operatorIds)
      
      // 🎯 Mapping optimisé avec Map pour O(1) lookup
      const companyMap = new Map(companies?.map((c: any) => [c.id, c]) || [])
      
      enrichedDepartures = (departures as any[]).map((departure: any) => ({
        ...departure,
        company: companyMap.get(departure.operator) || null
      }))
    }
  }
  
  return {
    departures: enrichedDepartures,
    total: count,
    totalPages: Math.ceil((count || 0) / Number(limit)),
  };
});