import { describe, it, expect } from 'vitest'
import { aggregateCompanyDepartures } from '~/server/utils/company-aggregate'
import type { AggregatableDeparture } from '~/server/utils/company-aggregate'

/**
 * Tous les chiffres de la page compagnie viennent de cette fonction. La page
 * a vocation à être partagée par la compagnie elle-même : un comptage faux s'y
 * verrait immédiatement.
 */

const departure = (overrides: Partial<AggregatableDeparture> = {}): AggregatableDeparture => ({
  origin: 'abidjan',
  destination: 'bouake',
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

    it('renvoie un agrégat vide sans départ', () => {
      const result = aggregateCompanyDepartures([])

      expect(result.routes).toEqual([])
      expect(result.cities).toEqual([])
      expect(result.stations).toEqual([])
      expect(result.comfortCategories).toEqual([])
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
