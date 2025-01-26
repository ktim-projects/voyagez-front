import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 9
    const offset = (page - 1) * limit

    const client = await serverSupabaseClient(event)
    
    // Récupérer le nombre total d'éléments
    const { count } = await client
      .from('news')
      .select('*', { count: 'exact', head: true })

    // Récupérer les news paginées
    const { data: news, error } = await client
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return {
      news,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des news'
    })
  }
})
