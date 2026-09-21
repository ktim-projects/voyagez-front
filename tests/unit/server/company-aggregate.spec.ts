import { describe, it, expect } from 'vitest'
import {
  aggregateCompanyDepartures,
  formatScheduleDuration,
  normalizeDepartureTime
} from '~/server/utils/company-aggregate'
import type { AggregatableDeparture } from '~/server/utils/company-aggregate'

/**
 * Tous les chiffres de la page compagnie viennent de cette fonction. La page
 * a vocation à être partagée par la compagnie elle-même : un comptage faux s'y
 * verrait immédiatement.
 */

const departure = (overrides: Partial<AggregatableDeparture> = {}): AggregatableDeparture => ({
  origin: 'abidjan',
  destination: 'bouake',
  departure_time: '06:00:00',
  arrival_time: '10:15:00',
  duration: '255',
  price: 5000,
  station: 'Adjamé',
  comfort_info: { category: 'Ordinaire' },
  ...overrides
})

describe('aggregateCompanyDepartures', () => {
  describe('trajets', () => {
    it('regroupe les départs par couple origine/destination', () => {
      const result = aggregateCompanyDepartures([
        departure(),
        departure(),
        departure({ destination: 'yamoussoukro' })
      ])

      expect(result.routes).toHaveLength(2)
      expect(result.stats.routes).toBe(2)
      expect(result.routes[0]).toMatchObject({
        fromSlug: 'abidjan',
        toSlug: 'bouake',
        departures: 2
      })
    })

    it('restitue les noms de villes accentués depuis les slugs', () => {
      const result = aggregateCompanyDepartures([
        departure({ origin: 'abidjan', destination: 'san-pedro' })
      ])

      expect(result.routes[0]).toMatchObject({ from: 'Abidjan', to: 'San-Pédro' })
    })

    it('conserve le slug brut pour une ville inconnue du mapping', () => {
      const result = aggregateCompanyDepartures([
        departure({ destination: 'ville-inconnue' })
      ])

      expect(result.routes[0]!.to).toBe('ville-inconnue')
    })

    it('ne confond pas un aller et son retour', () => {
      const result = aggregateCompanyDepartures([
        departure({ origin: 'abidjan', destination: 'bouake' }),
        departure({ origin: 'bouake', destination: 'abidjan' })
      ])

      expect(result.routes).toHaveLength(2)
    })

    it('classe les trajets les plus desservis en premier', () => {
      const result = aggregateCompanyDepartures([
        departure({ destination: 'yamoussoukro' }),
        departure({ destination: 'bouake' }),
        departure({ destination: 'bouake' }),
        departure({ destination: 'bouake' })
      ])

      expect(result.routes[0]).toMatchObject({ toSlug: 'bouake', departures: 3 })
      expect(result.routes[1]).toMatchObject({ toSlug: 'yamoussoukro', departures: 1 })
    })
  })

  describe('prix', () => {
    it('retient le prix le plus bas par trajet', () => {
      const result = aggregateCompanyDepartures([
        departure({ price: 8000 }),
        departure({ price: 5000 }),
        departure({ price: 6500 })
      ])

      expect(result.routes[0]!.minPrice).toBe(5000)
    })

    it('calcule la fourchette globale', () => {
      const result = aggregateCompanyDepartures([
        departure({ price: 5000 }),
        departure({ destination: 'korhogo', price: 12000 })
      ])

      expect(result.stats.minPrice).toBe(5000)
      expect(result.stats.maxPrice).toBe(12000)
    })

    it('ignore les prix absents sans les compter comme zéro', () => {
      const result = aggregateCompanyDepartures([
        departure({ price: null }),
        departure({ price: 5000 })
      ])

      expect(result.stats.minPrice).toBe(5000)
      expect(result.routes[0]!.minPrice).toBe(5000)
    })

    it('renvoie une fourchette nulle quand aucun prix n\'est connu', () => {
      const result = aggregateCompanyDepartures([departure({ price: null })])

      expect(result.stats.minPrice).toBeNull()
      expect(result.stats.maxPrice).toBeNull()
      expect(result.routes[0]!.minPrice).toBeNull()
    })
  })

  describe('villes, gares et confort', () => {
    it('dédoublonne les villes des deux côtés du trajet', () => {
      const result = aggregateCompanyDepartures([
        departure({ origin: 'abidjan', destination: 'bouake' }),
        departure({ origin: 'bouake', destination: 'korhogo' })
      ])

      expect(result.stats.cities).toBe(3)
      expect(result.cities.map(city => city.name)).toEqual(['Abidjan', 'Bouaké', 'Korhogo'])
    })

    it('dédoublonne les gares et ignore les valeurs vides', () => {
      const result = aggregateCompanyDepartures([
        departure({ station: 'Adjamé' }),
        departure({ station: 'Adjamé' }),
        departure({ station: '  Yopougon  ' }),
        departure({ station: '   ' }),
        departure({ station: null })
      ])

      expect(result.stations).toEqual(['Adjamé', 'Yopougon'])
    })

    it('liste les catégories de confort réellement proposées', () => {
      const result = aggregateCompanyDepartures([
        departure({ comfort_info: { category: 'VIP' } }),
        departure({ comfort_info: { category: 'Ordinaire' } }),
        departure({ comfort_info: { category: 'VIP' } }),
        departure({ comfort_info: null })
      ])

      expect(result.comfortCategories).toEqual(['Ordinaire', 'VIP'])
    })
  })

  describe('horaires', () => {
    it('range les départs d\'une ligne du plus matinal au plus tardif', () => {
      const result = aggregateCompanyDepartures([
        departure({ departure_time: '22:00:00' }),
        departure({ departure_time: '06:00:00' }),
        departure({ departure_time: '13:00:00' })
      ])

      expect(result.routes[0]!.schedule.map(slot => slot.departureTime))
        .toEqual(['06:00', '13:00', '22:00'])
    })

    it('retire les secondes des colonnes time de Postgres', () => {
      const result = aggregateCompanyDepartures([
        departure({ departure_time: '08:30:00', arrival_time: '12:30:00' })
      ])

      expect(result.routes[0]!.schedule[0]).toMatchObject({
        departureTime: '08:30',
        arrivalTime: '12:30'
      })
    })

    it('met la durée en forme depuis les minutes stockées', () => {
      const result = aggregateCompanyDepartures([departure({ duration: '255' })])

      expect(result.routes[0]!.schedule[0]!.duration).toBe('4h15')
    })

    it('donne l\'amplitude des durées de la ligne', () => {
      const result = aggregateCompanyDepartures([
        departure({ duration: '240' }),
        departure({ duration: '260' }),
        departure({ duration: '250' })
      ])

      expect(result.routes[0]!.durationSpan).toBe('4h00 – 4h20')
    })

    it('réduit l\'amplitude à une valeur quand tous les départs durent autant', () => {
      const result = aggregateCompanyDepartures([
        departure({ duration: '270' }),
        departure({ duration: '270' })
      ])

      expect(result.routes[0]!.durationSpan).toBe('4h30')
    })

    it('liste les gares et les conforts propres à chaque ligne', () => {
      const result = aggregateCompanyDepartures([
        departure({ station: 'Adjamé', comfort_info: { category: 'Ordinaire' } }),
        departure({ station: 'Yopougon', comfort_info: { category: 'VIP' } }),
        departure({
          destination: 'korhogo',
          station: 'Gare centrale',
          comfort_info: { category: 'VVIP' }
        })
      ])

      const abidjanBouake = result.routes.find(route => route.toSlug === 'bouake')!
      const abidjanKorhogo = result.routes.find(route => route.toSlug === 'korhogo')!

      expect(abidjanBouake.stations).toEqual(['Adjamé', 'Yopougon'])
      expect(abidjanBouake.comfortCategories).toEqual(['Ordinaire', 'VIP'])
      expect(abidjanKorhogo.stations).toEqual(['Gare centrale'])
      expect(abidjanKorhogo.comfortCategories).toEqual(['VVIP'])
    })
  })

  describe('premiers départs', () => {
    it('retient les quatre départs les plus matinaux, toutes lignes confondues', () => {
      const result = aggregateCompanyDepartures([
        departure({ destination: 'bouake', departure_time: '11:00:00' }),
        departure({ destination: 'korhogo', departure_time: '07:00:00' }),
        departure({ destination: 'san-pedro', departure_time: '06:30:00' }),
        departure({ destination: 'yamoussoukro', departure_time: '07:15:00' }),
        departure({ destination: 'bouake', departure_time: '06:00:00' })
      ])

      expect(result.nextDepartures.map(slot => slot.departureTime))
        .toEqual(['06:00', '06:30', '07:00', '07:15'])
    })

    it('porte la ligne de chaque départ mis en avant', () => {
      const result = aggregateCompanyDepartures([
        departure({ origin: 'abidjan', destination: 'san-pedro' })
      ])

      expect(result.nextDepartures[0]).toMatchObject({ from: 'Abidjan', to: 'San-Pédro' })
    })
  })

  describe('normalizeDepartureTime', () => {
    it('normalise les heures exploitables', () => {
      expect(normalizeDepartureTime('06:00:00')).toBe('06:00')
      expect(normalizeDepartureTime('6:05')).toBe('06:05')
      expect(normalizeDepartureTime('23:59:59')).toBe('23:59')
    })

    it('rejette ce qui n\'est pas une heure', () => {
      expect(normalizeDepartureTime(null)).toBeNull()
      expect(normalizeDepartureTime('')).toBeNull()
      expect(normalizeDepartureTime('matin')).toBeNull()
      expect(normalizeDepartureTime('24:00')).toBeNull()
      expect(normalizeDepartureTime('12:60')).toBeNull()
    })
  })

  describe('formatScheduleDuration', () => {
    it('met les minutes en heures alignables', () => {
      expect(formatScheduleDuration('255')).toBe('4h15')
      expect(formatScheduleDuration(240)).toBe('4h00')
      expect(formatScheduleDuration('540')).toBe('9h00')
    })

    it('garde les minutes seules en dessous de l\'heure', () => {
      expect(formatScheduleDuration('45')).toBe('45min')
    })

    it('rejette une durée absente ou incohérente', () => {
      expect(formatScheduleDuration(null)).toBeNull()
      expect(formatScheduleDuration(undefined)).toBeNull()
      expect(formatScheduleDuration('')).toBeNull()
      expect(formatScheduleDuration('0')).toBeNull()
      expect(formatScheduleDuration('environ 4h')).toBeNull()
    })
  })

  describe('données incomplètes', () => {
    it('écarte les départs sans origine ou sans destination', () => {
      const result = aggregateCompanyDepartures([
        departure(),
        departure({ origin: null }),
        departure({ destination: '' }),
        departure({ origin: '   ' })
      ])

      // Le compteur ne doit pas inclure des départs inexploitables :
      // il est affiché tel quel sur la page.
      expect(result.stats.departures).toBe(1)
      expect(result.routes).toHaveLength(1)
    })

    // departure_time est NOT NULL en base : ce cas est défensif, mais un
    // départ sans heure n'a sa place ni dans l'accordéon ni dans le compteur.
    it('écarte les départs sans heure de départ exploitable', () => {
      const result = aggregateCompanyDepartures([
        departure(),
        departure({ departure_time: null }),
        departure({ departure_time: '' }),
        departure({ departure_time: '25:00:00' })
      ])

      expect(result.stats.departures).toBe(1)
      expect(result.routes[0]!.schedule).toHaveLength(1)
    })

    it('tolère une heure d\'arrivée ou une durée manquante', () => {
      const result = aggregateCompanyDepartures([
        departure({ arrival_time: null, duration: null })
      ])

      expect(result.routes[0]!.schedule[0]).toMatchObject({
        departureTime: '06:00',
        arrivalTime: null,
        duration: null
      })
      expect(result.routes[0]!.durationSpan).toBeNull()
    })

    it('renvoie un agrégat vide sans départ', () => {
      const result = aggregateCompanyDepartures([])

      expect(result.routes).toEqual([])
      expect(result.cities).toEqual([])
      expect(result.stations).toEqual([])
      expect(result.comfortCategories).toEqual([])
      expect(result.nextDepartures).toEqual([])
      expect(result.stats).toEqual({
        cities: 0,
        routes: 0,
        departures: 0,
        minPrice: null,
        maxPrice: null
      })
    })
  })
})
