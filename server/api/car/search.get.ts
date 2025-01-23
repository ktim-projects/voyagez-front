import { serverSupabaseClient } from '#supabase/server'
import { createError } from 'h3'

// defineCachedEventHandler
export default defineEventHandler(async (event) => {
  const queryFromApp = getQuery(event);
  const { from, to, page = 1, limit = 3, maxPrice, companies, departurePeriod} = queryFromApp; 
  
  const offset: number = (Number(page) - 1) * Number(limit);

  if (!from || !to) {
    throw createError({
      statusCode: 400,
      message: 'Les paramètres de départ et d\'arrivée sont requis'
    });
  }

  console.log('fetching car journeys...');

  const client = await serverSupabaseClient(event)
  
  let query = client
    .from('departure_duplicate')
    .select(`
      *,
      company (
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

  // Apply range and ordering
  query = query
    .range(offset, offset + Number(limit) - 1)
    .order('departure_time', { ascending: true })

  const { data: departures, error, count } = await query

  if (error) {
    throw createError({ statusMessage: error.message })
  }
  
  return {
    departures,
    total: count,
    totalPages:  Math.ceil(count / limit),
  };
});