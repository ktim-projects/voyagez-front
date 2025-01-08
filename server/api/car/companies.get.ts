import { serverSupabaseClient } from '#supabase/server'
import { createError } from 'h3'

export default defineCachedEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: companies, error } = await client
    .from('company')
    .select('name, logo_url,contact, email,services')
    // order by departure date
    .order('created_at', { ascending: false })


  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return companies
});