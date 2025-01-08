import { serverSupabaseClient } from '#supabase/server'
import { createError } from 'h3'

// defineCachedEventHandler
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { from, to, page = 1, limit = 3, } = query; 
  

  // const limit = 3; // Nombre d'éléments par page
  // const page = parseInt(page as string) || 1;
  const offset: number = (Number(page) - 1) * Number(limit);

  if (!from || !to) {
    throw createError({
      statusCode: 400,
      message: 'Les paramètres de départ et d\'arrivée sont requis'
    });
  }

  console.log('fetching car journeys...');

  // Implement pagination and filtering
  

  const client = await serverSupabaseClient(event)
  

  const { data: departures, error, count } = await client
    .from('departure')
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
    .range(offset, offset + Number(limit) - 1) // Définit l'offset et la limite
    .order('departure_time', { ascending: true }) 


  if (error) {
    throw createError({ statusMessage: error.message })
  }

  console.log('departures--', departures.length);
  console.log('Total des résultats :', count);
  
  // return departures
  return {
    departures,
    total: count,
    totalPages: Math.ceil(count / limit),
  };

  // _meta: {
  //   total: count,
  //   limit: Number(limit), 
  //   offset
  // }
});