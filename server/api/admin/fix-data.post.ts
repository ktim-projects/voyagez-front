import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    
    if (body.action === 'create_missing_companies') {
      // Analyser les operators manquants
      const { data: departures } = await client
        .from('departure')
        .select('operator')
      
      const uniqueOperators = [...new Set(departures?.map(d => d.operator).filter(Boolean))]
      
      const { data: existingCompanies } = await client
        .from('company')
        .select('id')
        .in('id', uniqueOperators)
      
      const existingIds = new Set(existingCompanies?.map(c => c.id) || [])
      const missingOperators = uniqueOperators.filter(id => !existingIds.has(id))
      
      // Créer des compagnies par défaut pour les operators manquants
      const companiesToCreate = missingOperators.map((operatorId, index) => ({
        id: operatorId,
        name: `Compagnie ${index + 1}`,
        logo_url: null,
        contact: null,
        email: null,
        services: []
      }))
      
      if (companiesToCreate.length > 0) {
        const { data, error } = await client
          .from('company')
          .insert(companiesToCreate)
        
        if (error) {
          return {
            status: 'error',
            message: error.message
          }
        }
        
        return {
          status: 'success',
          message: `${companiesToCreate.length} compagnies créées`,
          created: companiesToCreate.length
        }
      } else {
        return {
          status: 'success',
          message: 'Aucune compagnie manquante à créer'
        }
      }
    }
    
    if (body.action === 'setup_foreign_key') {
      // Note: Cette action nécessite des privilèges admin sur Supabase
      // À exécuter manuellement dans l'interface Supabase SQL Editor
      const sqlQuery = `
        -- Ajouter une contrainte de clé étrangère si elle n'existe pas
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'departure_operator_fkey'
          ) THEN
            ALTER TABLE departure 
            ADD CONSTRAINT departure_operator_fkey 
            FOREIGN KEY (operator) REFERENCES company(id);
          END IF;
        END $$;
      `
      
      return {
        status: 'info',
        message: 'Exécutez cette requête SQL dans Supabase SQL Editor',
        sqlQuery
      }
    }
    
    return {
      status: 'error',
      message: 'Action non reconnue. Utilisez "create_missing_companies" ou "setup_foreign_key"'
    }
    
  } catch (err: any) {
    return {
      status: 'error',
      message: err?.message || 'Unknown error'
    }
  }
})
