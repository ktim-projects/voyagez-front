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

/** Un départ d'une ligne, tel qu'affiché dans l'accordéon des horaires. */
export interface CompanyDeparture {
  /** « 06:00 », déjà tronqué des secondes stockées par Postgres. */
  departureTime: string
  arrivalTime: string | null
  /** Durée mise en forme (« 4h15 »), nulle quand la base ne la donne pas. */
  duration: string | null
  price: number | null
  station: string | null
  comfort: string | null
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
  /** Gares de départ de cette ligne, triées. */
  stations: string[]
  /** Catégories de confort réellement proposées sur cette ligne. */
  comfortCategories: string[]
  /** « 4h00 – 4h20 », ou « 4h30 » quand tous les départs durent autant. */
  durationSpan: string | null
  /** Tous les départs de la ligne, du plus matinal au plus tardif. */
  schedule: CompanyDeparture[]
}

/** Un départ du panneau « Premiers départs », avec sa ligne. */
export interface CompanyNextDeparture extends CompanyDeparture {
  from: string
  to: string
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
  nextDepartures: CompanyNextDeparture[]
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
