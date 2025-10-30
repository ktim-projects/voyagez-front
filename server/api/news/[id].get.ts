import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Récupération de l'ID depuis l'URL
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      setResponseStatus(event, 400)
      return {
        message: 'ID not found'
      }
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
      setResponseStatus(event, 404)
      return {
        message: 'News not found'
      }
    }

    return news
  } catch (error) {
    console.error('Error fetching news:', error)
    setResponseStatus(event, 500)
    return {
      statusCode: 500,
      message: 'Error fetching news'
    }
  }
})
