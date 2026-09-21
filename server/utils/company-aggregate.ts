import { getCityFromSlug } from '~/utils/cities'
import type {
  CompanyCity,
  CompanyDeparture,
  CompanyNextDeparture,
  CompanyPageStats,
  CompanyRoute
} from '~/types/company'

/**
 * Départ tel que lu en base, réduit aux colonnes utiles à la page compagnie.
 */
export interface AggregatableDeparture {
  origin: string | null
  destination: string | null
  departure_time?: string | null
  arrival_time?: string | null
  /** Durée en minutes, stockée en `text` par la table `departure`. */
  duration?: string | number | null
  price?: number | null
  station?: string | null
  comfort_info?: { category?: string } | null
}

export interface CompanyAggregate {
  routes: CompanyRoute[]
  cities: CompanyCity[]
  stations: string[]
  comfortCategories: string[]
  nextDepartures: CompanyNextDeparture[]
  stats: CompanyPageStats
}

/** Nombre de départs mis en avant dans le panneau « Premiers départs ». */
const NEXT_DEPARTURES_COUNT = 4

/**
 * Heure affichable à partir d'une colonne `time` de Postgres, qui arrive avec
 * ses secondes (`06:00:00`). Renvoie null pour une valeur inexploitable :
 * l'accordéon des horaires n'a rien à en faire.
 */
export function normalizeDepartureTime(value?: string | null): string | null {
  const parts = value?.trim().split(':')

  if (!parts || parts.length < 2) return null

  const hours = Number(parts[0])
  const minutes = Number(parts[1])

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Durée mise en forme pour la page compagnie : `4h15`, et `45min` en dessous
 * de l'heure. La colonne est un `text` qui contient des minutes.
 *
 * Le format diffère volontairement de `formatDuration()` (« 4h 15min ») :
 * ici les durées sont alignées en colonne, elles doivent avoir la même
 * largeur d'une ligne à l'autre.
 */
export function formatScheduleDuration(duration?: string | number | null): string | null {
  const minutes = typeof duration === 'number' ? duration : Number(duration)

  if (!Number.isFinite(minutes) || minutes <= 0) return null

  const hours = Math.floor(minutes / 60)
  const rest = Math.round(minutes % 60)

  return hours > 0 ? `${hours}h${String(rest).padStart(2, '0')}` : `${rest}min`
}

/** Minutes depuis minuit, pour trier les départs entre eux. */
const toMinutes = (time: string): number => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)

  return hours * 60 + minutes
}

interface RouteAccumulator {
  route: CompanyRoute
  stations: Set<string>
  comfortCategories: Set<string>
  durations: number[]
}

/**
 * Agrège les départs d'une compagnie en trajets, horaires, villes, gares et
 * fourchette de prix.
 *
 * La base stocke des slugs dans origin/destination (cf. CLAUDE.md) : ils sont
 * repassés par getCityFromSlug() pour l'affichage, tout en conservant le slug
 * pour construire les liens vers /results/:from/:to.
 *
 * Toutes les valeurs renvoyées sont comptées, jamais estimées : la page est
 * destinée à être partagée par la compagnie elle-même.
 */
export function aggregateCompanyDepartures(departures: AggregatableDeparture[]): CompanyAggregate {
  const routes = new Map<string, RouteAccumulator>()
  const cities = new Map<string, string>()
  const stations = new Set<string>()
  const comfortCategories = new Set<string>()
  const prices: number[] = []
  const allDepartures: CompanyNextDeparture[] = []

  let countedDepartures = 0

  for (const departure of departures) {
    const origin = departure.origin?.trim()
    const destination = departure.destination?.trim()
    const departureTime = normalizeDepartureTime(departure.departure_time)

    // Un départ sans origine, sans destination ou sans heure n'est exploitable
    // nulle part sur la page : il ne doit pas non plus gonfler le compteur,
    // sinon l'accordéon afficherait moins de lignes qu'il n'en annonce.
    if (!origin || !destination || !departureTime) continue

    countedDepartures += 1

    const price = typeof departure.price === 'number' && Number.isFinite(departure.price)
      ? departure.price
      : null

    const station = departure.station?.trim() || null
    const comfort = departure.comfort_info?.category?.trim() || null
    const durationMinutes = Number(departure.duration)

    const scheduled: CompanyDeparture = {
      departureTime,
      arrivalTime: normalizeDepartureTime(departure.arrival_time),
      duration: formatScheduleDuration(departure.duration),
      price,
      station,
      comfort
    }

    const from = getCityFromSlug(origin) ?? origin
    const to = getCityFromSlug(destination) ?? destination
    const key = `${origin}|${destination}`
    const existing = routes.get(key)

    if (existing) {
      existing.route.departures += 1
      existing.route.schedule.push(scheduled)
      if (price !== null && (existing.route.minPrice === null || price < existing.route.minPrice)) {
        existing.route.minPrice = price
      }
      if (station) existing.stations.add(station)
      if (comfort) existing.comfortCategories.add(comfort)
      if (Number.isFinite(durationMinutes) && durationMinutes > 0) {
        existing.durations.push(durationMinutes)
      }
    } else {
      routes.set(key, {
        route: {
          fromSlug: origin,
          toSlug: destination,
          from,
          to,
          departures: 1,
          minPrice: price,
          stations: [],
          comfortCategories: [],
          durationSpan: null,
          schedule: [scheduled]
        },
        stations: new Set(station ? [station] : []),
        comfortCategories: new Set(comfort ? [comfort] : []),
        durations: Number.isFinite(durationMinutes) && durationMinutes > 0 ? [durationMinutes] : []
      })
    }

    allDepartures.push({ ...scheduled, from, to })

    cities.set(origin, from)
    cities.set(destination, to)

    if (station) stations.add(station)
    if (comfort) comfortCategories.add(comfort)
    if (price !== null) prices.push(price)
  }

  for (const entry of routes.values()) {
    entry.route.stations = [...entry.stations].sort((a, b) => a.localeCompare(b))
    entry.route.comfortCategories = [...entry.comfortCategories].sort((a, b) => a.localeCompare(b))
    entry.route.durationSpan = formatDurationSpan(entry.durations)
    entry.route.schedule.sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime))
  }

  // Les trajets les plus desservis en premier : c'est ce que la compagnie
  // veut mettre en avant quand elle partage sa page.
  const sortedRoutes = [...routes.values()]
    .map(entry => entry.route)
    .sort((a, b) => {
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
    // « Premiers départs » : les plus matinaux de la grille horaire. Rien
    // n'est calculé par rapport à l'heure courante, le HTML servi resterait
    // faux dès la minute suivante.
    nextDepartures: [...allDepartures]
      .sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime))
      .slice(0, NEXT_DEPARTURES_COUNT),
    stats: {
      cities: cities.size,
      routes: routes.size,
      departures: countedDepartures,
      minPrice: prices.length ? Math.min(...prices) : null,
      maxPrice: prices.length ? Math.max(...prices) : null
    }
  }
}

/**
 * Amplitude des durées d'une ligne : « 4h00 – 4h20 », réduite à une seule
 * valeur quand tous les départs mettent le même temps.
 */
function formatDurationSpan(durations: number[]): string | null {
  if (durations.length === 0) return null

  const shortest = formatScheduleDuration(Math.min(...durations))
  const longest = formatScheduleDuration(Math.max(...durations))

  if (!shortest || !longest) return null

  return shortest === longest ? shortest : `${shortest} – ${longest}`
}
