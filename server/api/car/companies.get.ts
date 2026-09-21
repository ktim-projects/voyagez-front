import { serverSupabaseClient } from '#supabase/server'
import { getCompanySlug } from '~/utils/companies'
import type { CompanyListItem } from '~/types/company'

/**
 * Liste des compagnies, pour l'index /compagnies.
 *
 * select('*') : les colonnes de page compagnie (slug, description,
 * brand_color...) n'existent que si add_company_page_columns.sql a été
 * appliquée. L'endpoint doit fonctionner dans les deux cas.
 */

interface CompanyRow {
  id: string
  name: string
  logo_url?: string | null
  slug?: string | null
  description?: string | null
  brand_color?: string | null
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data, error } = await client
    .from('company')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error fetching companies' })
  }

  const companies: CompanyListItem[] = ((data ?? []) as unknown as CompanyRow[])
    .filter(row => row.name?.trim())
    .map(row => ({
      id: row.id,
      name: row.name,
      slug: getCompanySlug(row),
      logoUrl: row.logo_url ?? null,
      description: row.description?.trim() || null,
      brandColor: normalizeBrandColor(row.brand_color)
    }))

  return { companies }
})

function normalizeBrandColor(color?: string | null): string | null {
  const value = color?.trim()

  return value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : null
}
