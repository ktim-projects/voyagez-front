/**
 * Formes renvoyées par les endpoints /api/car/companies.
 *
 * Tout y est soit stocké en base, soit calculé à partir des départs réels :
 * la page compagnie a vocation à être partagée par la compagnie elle-même,
 * une donnée estimée s'y verrait.
 */

export interface CompanyPageCompany {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  contact: string | null
  email: string | null
  services: string[]
  description: string | null
  brandColor: string | null
  whatsapp: string | null
  website: string | null
}

/** Un trajet desservi par la compagnie, agrégé depuis ses départs. */
export interface CompanyRoute {
  /** Slugs tels que stockés en base, pour construire les liens. */
  fromSlug: string
  toSlug: string
  /** Noms affichables, avec accents. */
  from: string
  to: string
  departures: number
  minPrice: number | null
}

export interface CompanyCity {
  slug: string
  name: string
}

export interface CompanyPageStats {
  cities: number
  routes: number
  departures: number
  minPrice: number | null
  maxPrice: number | null
}

export interface CompanyPageResponse {
  company: CompanyPageCompany
  routes: CompanyRoute[]
  cities: CompanyCity[]
  stations: string[]
  comfortCategories: string[]
  stats: CompanyPageStats
}

/** Carte de l'index /compagnies. */
export interface CompanyListItem {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  description: string | null
  brandColor: string | null
}

export interface CompanyListResponse {
  companies: CompanyListItem[]
}
