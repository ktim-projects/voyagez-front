import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Récupération de l'ID depuis l'URL
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID manquant'
      })
    }

    const client = await serverSupabaseClient(event)
    
    const { data: news, error } = await client
      .from('news')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    if (!news) {
      throw createError({
        statusCode: 404,
        message: 'News non trouvée'
      })
    }

    return news
  } catch (error) {
    console.error('Error fetching news:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erreur lors de la récupération de la news'
    })
  }
})
