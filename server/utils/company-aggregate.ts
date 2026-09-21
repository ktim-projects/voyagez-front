import { getCityFromSlug } from '~/utils/cities'
import type { CompanyCity, CompanyPageStats, CompanyRoute } from '~/types/company'

/**
 * Départ tel que lu en base, réduit aux colonnes utiles à la page compagnie.
 */
export interface AggregatableDeparture {
  origin: string | null
  destination: string | null
  price?: number | null
  station?: string | null
  comfort_info?: { category?: string } | null
}

export interface CompanyAggregate {
  routes: CompanyRoute[]
  cities: CompanyCity[]
  stations: string[]
  comfortCategories: string[]
  stats: CompanyPageStats
}

/**
 * Agrège les départs d'une compagnie en trajets, villes, gares et fourchette
 * de prix.
 *
 * La base stocke des slugs dans origin/destination (cf. CLAUDE.md) : ils sont
 * repassés par getCityFromSlug() pour l'affichage, tout en conservant le slug
 * pour construire les liens vers /results/:from/:to.
 *
 * Toutes les valeurs renvoyées sont comptées, jamais estimées : la page est
 * destinée à être partagée par la compagnie elle-même.
 */
export function aggregateCompanyDepartures(departures: AggregatableDeparture[]): CompanyAggregate {
  const routes = new Map<string, CompanyRoute>()
  const cities = new Map<string, string>()
  const stations = new Set<string>()
  const comfortCategories = new Set<string>()
  const prices: number[] = []

  let countedDepartures = 0

  for (const departure of departures) {
    const origin = departure.origin?.trim()
    const destination = departure.destination?.trim()

    // Un départ sans origine ou sans destination n'est exploitable nulle part
    // sur la page : il ne doit pas non plus gonfler le compteur.
    if (!origin || !destination) continue

    countedDepartures += 1

    const price = typeof departure.price === 'number' && Number.isFinite(departure.price)
      ? departure.price
      : null

    const key = `${origin}|${destination}`
    const existing = routes.get(key)

    if (existing) {
      existing.departures += 1
      if (price !== null && (existing.minPrice === null || price < existing.minPrice)) {
        existing.minPrice = price
      }
    } else {
      routes.set(key, {
        fromSlug: origin,
        toSlug: destination,
        from: getCityFromSlug(origin) ?? origin,
        to: getCityFromSlug(destination) ?? destination,
        departures: 1,
        minPrice: price
      })
    }

    cities.set(origin, getCityFromSlug(origin) ?? origin)
    cities.set(destination, getCityFromSlug(destination) ?? destination)

    const station = departure.station?.trim()
    if (station) stations.add(station)

    const category = departure.comfort_info?.category?.trim()
    if (category) comfortCategories.add(category)

    if (price !== null) prices.push(price)
  }

  // Les trajets les plus desservis en premier : c'est ce que la compagnie
  // veut mettre en avant quand elle partage sa page.
  const sortedRoutes = [...routes.values()].sort((a, b) => {
    if (b.departures !== a.departures) return b.departures - a.departures
    if (a.from !== b.from) return a.from.localeCompare(b.from)
    return a.to.localeCompare(b.to)
  })

  return {
    routes: sortedRoutes,
    cities: [...cities.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    stations: [...stations].sort((a, b) => a.localeCompare(b)),
    comfortCategories: [...comfortCategories].sort((a, b) => a.localeCompare(b)),
    stats: {
      cities: cities.size,
      routes: routes.size,
      departures: countedDepartures,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null
    }
  }
}
