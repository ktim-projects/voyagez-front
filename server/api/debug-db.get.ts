import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    
    // Test 1: Structure de la table departure
    const { data: departureData, error: departureError } = await client
      .from('departure')
      .select('*')
      .limit(1)
    
    // Test 2: Structure de la table company
    const { data: companyData, error: companyError } = await client
      .from('company')
      .select('*')
      .limit(1)
    
    // Test 3: Query avec relation (version simple)
    const { data: relationData, error: relationError } = await client
      .from('departure')
      .select(`
        id,
        origin,
        destination,
        operator,
        company:operator (*)
      `)
      .limit(1)
    
    // Test 4: Vérifier si un operator existe dans company
    const operatorId = (departureData?.[0] as any)?.operator
    const { data: operatorCheck, error: operatorError } = await client
      .from('company')
      .select('id, name')
      .eq('id', operatorId)
      .single()
    
    // Test 5: Query manuelle avec join
    const { data: manualJoin, error: joinError } = await client
      .from('departure')
      .select(`
        *,
        company!departure_operator_fkey (
          id,
          name,
          logo_url
        )
      `)
      .limit(1)
    
    return {
      status: 'success',
      tests: {
        departure: {
          data: departureData,
          error: departureError?.message,
          columns: departureData?.[0] ? Object.keys(departureData[0]) : []
        },
        company: {
          data: companyData,
          error: companyError?.message,
          columns: companyData?.[0] ? Object.keys(companyData[0]) : []
        },
        relation: {
          data: relationData,
          error: relationError?.message
        },
        operatorExists: {
          data: operatorCheck,
          error: operatorError?.message
        },
        manualJoin: {
          data: manualJoin,
          error: joinError?.message
        }
      }
    }
    
  } catch (err: any) {
    return {
      status: 'error',
      message: err?.message || 'Unknown error'
    }
  }
})
