import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    
    // 1. Analyser les données departure
    const { data: departures, count: departureCount } = await client
      .from('departure')
      .select('operator', { count: 'exact' })
    
    // 2. Analyser les données company
    const { data: companies, count: companyCount } = await client
      .from('company')
      .select('id, name', { count: 'exact' })
    
    // 3. Identifier les UUIDs uniques dans departure.operator
    const uniqueOperators = [...new Set(departures?.map(d => d.operator).filter(Boolean))]
    
    // 4. Vérifier combien d'operators existent dans company
    const { data: existingCompanies } = await client
      .from('company')
      .select('id, name')
      .in('id', uniqueOperators)
    
    // 5. Identifier les operators manquants
    const existingIds = new Set(existingCompanies?.map(c => c.id) || [])
    const missingOperators = uniqueOperators.filter(id => !existingIds.has(id))
    
    // 6. Analyser les operators les plus fréquents
    const operatorFrequency = departures?.reduce((acc: any, d) => {
      if (d.operator) {
        acc[d.operator] = (acc[d.operator] || 0) + 1
      }
      return acc
    }, {})
    
    const topOperators = Object.entries(operatorFrequency || {})
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
    
    return {
      status: 'success',
      analysis: {
        totalDepartures: departureCount,
        totalCompanies: companyCount,
        uniqueOperators: uniqueOperators.length,
        existingCompanies: existingCompanies?.length || 0,
        missingOperators: missingOperators.length,
        dataIntegrity: {
          percentage: ((existingCompanies?.length || 0) / uniqueOperators.length * 100).toFixed(2) + '%',
          status: missingOperators.length === 0 ? 'GOOD' : 'NEEDS_FIX'
        },
        missingOperatorIds: missingOperators.slice(0, 5), // Premiers 5 pour debug
        topOperators: topOperators.map(([id, count]) => ({
          operatorId: id,
          departureCount: count,
          companyExists: existingIds.has(id)
        }))
      }
    }
    
  } catch (err: any) {
    return {
      status: 'error',
      message: err?.message || 'Unknown error'
    }
  }
})
