import { serverSupabaseClient } from '#supabase/server'
import { getCompanySlug } from '~/utils/companies'
import { aggregateCompanyDepartures } from '../../../utils/company-aggregate'
import type { AggregatableDeparture } from '../../../utils/company-aggregate'

/**
 * Données d'une page compagnie.
 *
 * Tout ce qui est renvoyé ici est soit stocké en base, soit calculé à partir
 * des départs réels. Aucun chiffre n'est estimé : la page est destinée à être
 * partagée par la compagnie elle-même, une donnée fausse s'y verrait.
 */

// La table est petite (une douzaine de lignes) et le slug peut être dérivé du
// nom : on la lit entièrement plutôt que de filtrer en SQL sur une colonne qui
// n'existe pas forcément encore.
const MAX_DEPARTURES = 2000

interface CompanyRow {
  id: string
  name: string
  logo_url?: string | null
  contact?: string | null
  email?: string | null
  services?: string[] | null
  // Colonnes ajoutées par add_company_page_columns.sql, absentes tant que la
  // migration n'est pas appliquée.
  slug?: string | null
  brand_color?: string | null
  description?: string | null
  whatsapp?: string | null
  website?: string | null
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const client = await serverSupabaseClient(event)

  // select('*') : la page doit fonctionner avant comme après la migration qui
  // ajoute slug, brand_color, description, whatsapp et website.
  const { data: companiesData, error: companiesError } = await client
    .from('company')
    .select('*')

  if (companiesError) {
    throw createError({ statusCode: 500, statusMessage: 'Error fetching companies' })
  }

  const companies = (companiesData ?? []) as unknown as CompanyRow[]
  const company = companies.find(row => getCompanySlug(row) === slug)

  if (!company) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found' })
  }

  const { data: departuresData, error: departuresError } = await client
    .from('departure')
    .select('origin, destination, price, station, comfort_info')
    .eq('operator', company.id)
    .limit(MAX_DEPARTURES)

  if (departuresError) {
    throw createError({ statusCode: 500, statusMessage: 'Error fetching departures' })
  }

  const departures = (departuresData ?? []) as unknown as AggregatableDeparture[]

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: getCompanySlug(company),
      logoUrl: company.logo_url ?? null,
      contact: company.contact ?? null,
      email: company.email ?? null,
      services: normalizeServices(company.services),
      description: company.description?.trim() || null,
      brandColor: normalizeBrandColor(company.brand_color),
      whatsapp: company.whatsapp?.trim() || null,
      website: company.website?.trim() || null
    },
    ...aggregateCompanyDepartures(departures)
  }
})

/**
 * `services` est une colonne jsonb : elle peut contenir un tableau, une chaîne
 * unique, ou n'importe quoi si la donnée a été saisie à la main.
 */
function normalizeServices(services: unknown): string[] {
  if (Array.isArray(services)) {
    return services.map(service => String(service).trim()).filter(Boolean)
  }

  if (typeof services === 'string' && services.trim()) {
    return services.split(',').map(service => service.trim()).filter(Boolean)
  }

  return []
}

/**
 * La contrainte SQL garantit le format, mais la page peut être servie avant
 * que la migration ne soit appliquée : on revalide ici.
 */
function normalizeBrandColor(color?: string | null): string | null {
  const value = color?.trim()

  return value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : null
}

