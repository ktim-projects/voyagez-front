import { serverSupabaseClient } from '#supabase/server'

export default defineCachedEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: companies, error } = await client
    .from('company')
    .select('name, logo_url,contact, email,services')
    // order by departure date
    .order('created_at', { ascending: false })


  if (error) {
    setResponseStatus(event, 400)
    return {
      message: error.message
    }
  }

  return companies
});