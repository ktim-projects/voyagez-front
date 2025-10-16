import { describe, it, expect } from 'vitest'
import {
  getCityFromSlug,
  getSlugFromCity,
  isCityValid,
  getAllCities,
  getAllCitySlugs,
  citySlugMap
} from '~/utils/cities'
import { useCities } from '~/composables/useCities'

describe('cities utils', () => {
  describe('getCityFromSlug', () => {
    it('should return correct city name for valid slug', () => {
      expect(getCityFromSlug('abidjan')).toBe('Abidjan')
      expect(getCityFromSlug('bouake')).toBe('Bouaké')
      expect(getCityFromSlug('yamoussoukro')).toBe('Yamoussoukro')
      expect(getCityFromSlug('san-pedro')).toBe('San-Pédro')
    })



    it('should return null for non-existent slug', () => {
      expect(getCityFromSlug('ville-inexistante')).toBeNull()
      expect(getCityFromSlug('paris')).toBeNull()
      expect(getCityFromSlug('new-york')).toBeNull()
    })

    it('should be case insensitive', () => {
      expect(getCityFromSlug('ABIDJAN')).toBe('Abidjan')
      expect(getCityFromSlug('BoUaKe')).toBe('Bouaké')
      expect(getCityFromSlug('YaMoUsSoUkRo')).toBe('Yamoussoukro')
    })

    it('should handle empty or invalid slugs', () => {
      expect(getCityFromSlug('')).toBeNull()
      expect(getCityFromSlug('   ')).toBeNull()
    })

    it('should return cities with accents correctly', () => {
      expect(getCityFromSlug('bouake')).toBe('Bouaké')
      expect(getCityFromSlug('korhogo')).toBe('Korhogo')
      expect(getCityFromSlug('daloa')).toBe('Daloa')
      expect(getCityFromSlug('duekoue')).toBe('Duékoué')
      expect(getCityFromSlug('odienne')).toBe('Odienné')
    })
  })

  describe('getSlugFromCity', () => {
    it('should correctly convert city names to slugs', () => {
      expect(getSlugFromCity('Abidjan')).toBe('abidjan')
      expect(getSlugFromCity('Bouaké')).toBe('bouake')
      expect(getSlugFromCity('Yamoussoukro')).toBe('yamoussoukro')
      expect(getSlugFromCity('San-Pédro')).toBe('san-pedro')
    })

    it('should remove accents', () => {
      expect(getSlugFromCity('Bouaké')).toBe('bouake')
      expect(getSlugFromCity('Séguéla')).toBe('seguela')
      expect(getSlugFromCity('Odienné')).toBe('odienne')
      expect(getSlugFromCity('Duékoué')).toBe('duekoue')
      expect(getSlugFromCity('Adiaké')).toBe('adiake')
    })

    it('should convert to lowercase', () => {
      expect(getSlugFromCity('ABIDJAN')).toBe('abidjan')
      expect(getSlugFromCity('BoUaKé')).toBe('bouake')
      expect(getSlugFromCity('YAMOUSSOUKRO')).toBe('yamoussoukro')
    })

    it('should preserve dashes', () => {
      expect(getSlugFromCity('San-Pédro')).toBe('san-pedro')
      expect(getSlugFromCity('Grand-Bassam')).toBe('grand-bassam')
      expect(getSlugFromCity('Grand-Lahou')).toBe('grand-lahou')
    })

    it('should replace spaces with dashes', () => {
      expect(getSlugFromCity('San Pedro')).toBe('san-pedro')
      expect(getSlugFromCity('Grand Bassam')).toBe('grand-bassam')
    })

    it('should handle special characters', () => {
      expect(getSlugFromCity('Ville@Test!')).toBe('ville-test')
      expect(getSlugFromCity('Test#123')).toBe('test-123')
    })

    it('should remove leading and trailing dashes', () => {
      expect(getSlugFromCity('-Abidjan-')).toBe('abidjan')
      expect(getSlugFromCity('--Bouaké--')).toBe('bouake')
    })

    it('should handle empty strings', () => {
      expect(getSlugFromCity('')).toBe('')
      expect(getSlugFromCity('   ')).toBe('')
    })
  })

  describe('isCityValid', () => {
    it('should return true for valid cities (full name)', () => {
      expect(isCityValid('Abidjan')).toBe(true)
      expect(isCityValid('Bouaké')).toBe(true)
      expect(isCityValid('Yamoussoukro')).toBe(true)
      expect(isCityValid('San-Pédro')).toBe(true)
      expect(isCityValid('Korhogo')).toBe(true)
    })

    it('should return true for valid cities (slug)', () => {
      expect(isCityValid('abidjan')).toBe(true)
      expect(isCityValid('bouake')).toBe(true)
      expect(isCityValid('yamoussoukro')).toBe(true)
      expect(isCityValid('san-pedro')).toBe(true)
    })

    it('should return false for non-existent cities', () => {
      expect(isCityValid('Paris')).toBe(false)
      expect(isCityValid('New York')).toBe(false)
      expect(isCityValid('VilleInconnue')).toBe(false)
      expect(isCityValid('ville-inexistante')).toBe(false)
    })

    it('should be case insensitive', () => {
      expect(isCityValid('ABIDJAN')).toBe(true)
      expect(isCityValid('aBiDjAn')).toBe(true)
      expect(isCityValid('BOUAKE')).toBe(true)
    })

    it('should handle accents', () => {
      expect(isCityValid('Bouaké')).toBe(true)
      expect(isCityValid('Bouake')).toBe(true)
      expect(isCityValid('San-Pédro')).toBe(true)
      expect(isCityValid('San-Pedro')).toBe(true)
    })

    it('should return false for empty strings', () => {
      expect(isCityValid('')).toBe(false)
      expect(isCityValid('   ')).toBe(false)
    })

    it('should validate all Ivory Coast cities', () => {
      const ivorianCities = [
        'Abidjan', 'Bouaké', 'Yamoussoukro', 'Daloa', 'Korhogo',
        'San-Pédro', 'Man', 'Gagnoa', 'Divo', 'Abengourou'
      ]

      ivorianCities.forEach(city => {
        expect(isCityValid(city)).toBe(true)
      })
    })

    it('should invalidate cities outside Ivory Coast', () => {
      const foreignCities = [
        'Paris', 'Londres', 'New York', 'Tokyo', 'Berlin'
      ]

      foreignCities.forEach(city => {
        expect(isCityValid(city)).toBe(false)
      })
    })
  })

  describe('getAllCities', () => {
    it('should return an array of cities', () => {
      const cities = getAllCities()

      expect(Array.isArray(cities)).toBe(true)
      expect(cities.length).toBeGreaterThan(0)
    })

    it('should contain main cities', () => {
      const cities = getAllCities()

      expect(cities).toContain('Abidjan')
      expect(cities).toContain('Bouaké')
      expect(cities).toContain('Yamoussoukro')
      expect(cities).toContain('San-Pédro')
      expect(cities).toContain('Korhogo')
      expect(cities).toContain('Daloa')
    })

    it('should return names with accents and capitals', () => {
      const cities = getAllCities()

      expect(cities).toContain('Bouaké') // Avec accent
      expect(cities).toContain('San-Pédro') // Avec accent et tiret
      expect(cities).toContain('Odienné') // Avec accent
    })

    it('should not contain duplicates', () => {
      const cities = getAllCities()
      const uniqueCities = [...new Set(cities)]

      expect(cities.length).toBe(uniqueCities.length)
    })

    it('should return correct number of cities', () => {
      const cities = getAllCities()
      const slugCount = Object.keys(citySlugMap).length

      expect(cities.length).toBe(slugCount)
    })

    it('should have all cities as non-empty strings', () => {
      const cities = getAllCities()

      cities.forEach(city => {
        expect(typeof city).toBe('string')
        expect(city.length).toBeGreaterThan(0)
      })
    })
  })

  describe('getAllCitySlugs', () => {
    it('should return an array of slugs', () => {
      const slugs = getAllCitySlugs()

      expect(Array.isArray(slugs)).toBe(true)
      expect(slugs.length).toBeGreaterThan(0)
    })

    it('should contain main city slugs', () => {
      const slugs = getAllCitySlugs()

      expect(slugs).toContain('abidjan')
      expect(slugs).toContain('bouake')
      expect(slugs).toContain('yamoussoukro')
      expect(slugs).toContain('san-pedro')
      expect(slugs).toContain('korhogo')
    })

    it('should have all slugs in lowercase', () => {
      const slugs = getAllCitySlugs()

      slugs.forEach(slug => {
        // Vérifier que le slug est en minuscules
        expect(slug).toBe(slug.toLowerCase())
        // Vérifier que c'est une chaîne non vide
        expect(slug.length).toBeGreaterThan(0)
      })
    })

    it('ne contient pas de doublons', () => {
      const slugs = getAllCitySlugs()
      const uniqueSlugs = [...new Set(slugs)]

      expect(slugs.length).toBe(uniqueSlugs.length)
    })

    it('should return same count as getAllCities', () => {
      const cities = getAllCities()
      const slugs = getAllCitySlugs()

      expect(slugs.length).toBe(cities.length)
    })

    it('should have all slugs as non-empty strings', () => {
      const slugs = getAllCitySlugs()

      slugs.forEach(slug => {
        expect(typeof slug).toBe('string')
        expect(slug.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Function consistency', () => {
    it('should return a city for each slug with getCityFromSlug', () => {
      const slugs = getAllCitySlugs()

      slugs.forEach(slug => {
        const city = getCityFromSlug(slug)
        expect(city).not.toBeNull()
        expect(typeof city).toBe('string')
      })
    })

    it('should have all getAllCities cities in citySlugMap', () => {
      const cities = getAllCities()

      cities.forEach(city => {
        // Vérifier que la ville existe dans les valeurs de citySlugMap
        const slugs = getAllCitySlugs()
        const cityExists = slugs.some(slug => getCityFromSlug(slug) === city)
        expect(cityExists).toBe(true)
      })
    })

    it('should have all getAllCitySlugs slugs matching cities', () => {
      const slugs = getAllCitySlugs()

      slugs.forEach(slug => {
        const city = getCityFromSlug(slug)
        expect(city).not.toBeNull()
        expect(typeof city).toBe('string')
      })
    })

    it('should validate main cities with isCityValid', () => {
      const mainCities = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'Daloa', 'Korhogo']

      mainCities.forEach(city => {
        expect(isCityValid(city)).toBe(true)
      })
    })

    it('should validate main slugs with isCityValid', () => {
      const mainSlugs = ['abidjan', 'bouake', 'yamoussoukro', 'daloa', 'korhogo']

      mainSlugs.forEach(slug => {
        expect(isCityValid(slug)).toBe(true)
      })
    })
  })

  describe('Edge cases', () => {
    it('should handle cities with multiple dashes', () => {
      // Si une telle ville existait
      const slug = 'ville-avec-plusieurs-tirets'
      const city = getCityFromSlug(slug)
      
      if (city) {
        const regeneratedSlug = getSlugFromCity(city)
        expect(regeneratedSlug).toBe(slug)
      }
    })





    it('performance: getAllCities should be fast', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        getAllCities()
      }
      const end = performance.now()
      
      // Devrait prendre moins de 100ms pour 1000 appels
      expect(end - start).toBeLessThan(100)
    })

    it('performance: isCityValid should be fast', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        isCityValid('Abidjan')
        isCityValid('VilleInexistante')
      }
      const end = performance.now()
      
      // Devrait prendre moins de 50ms pour 2000 appels
      expect(end - start).toBeLessThan(50)
    })
  })

  describe('International cities (outside Ivory Coast)', () => {
    it('should contain West African cities', () => {
      const cities = getAllCities()

      // Vérifier quelques villes internationales présentes
      expect(cities).toContain('Accra') // Ghana
      expect(cities).toContain('Bamako') // Mali
      expect(cities).toContain('Conakry') // Guinée
      expect(cities).toContain('Lomé') // Togo
      expect(cities).toContain('Cotonou') // Bénin
      expect(cities).toContain('Ouaga') // Burkina Faso
    })

    it('should validate present international cities', () => {
      expect(isCityValid('Accra')).toBe(true)
      expect(isCityValid('Bamako')).toBe(true)
      expect(isCityValid('Conakry')).toBe(true)
      expect(isCityValid('Lomé')).toBe(true)
    })

    it('should correctly slugify international cities', () => {
      expect(getSlugFromCity('Lomé')).toBe('lome')
      expect(getSlugFromCity('Nzérékoré')).toBe('nzerekore')
      expect(getCityFromSlug('lome')).toBe('Lomé')
      expect(getCityFromSlug('nzerekore')).toBe('Nzérékoré')
    })
  })

  describe('Data consistency between citiesData and citySlugMap', () => {
    it('should have all citiesData cities in citySlugMap', () => {
      const { cities } = useCities()
      const slugMapCities = getAllCities()
      const missingCities: string[] = []

      cities.forEach(city => {
        if (!slugMapCities.includes(city.name)) {
          missingCities.push(city.name)
        }
      })

      if (missingCities.length > 0) {
        console.error('❌ Missing cities in citySlugMap:', missingCities)
      }

      expect(missingCities).toEqual([])
      expect(missingCities.length).toBe(0)
    })

    it('should have same number of cities in both sources', () => {
      const { cities } = useCities()
      const slugMapCities = getAllCities()

      expect(slugMapCities.length).toBe(cities.length)
    })

    it('should have all citySlugMap cities in citiesData', () => {
      const { cities } = useCities()
      const citiesDataNames = cities.map(c => c.name)
      const slugMapCities = getAllCities()
      const extraCities: string[] = []

      slugMapCities.forEach(city => {
        if (!citiesDataNames.includes(city)) {
          extraCities.push(city)
        }
      })

      if (extraCities.length > 0) {
        console.error('❌ Extra cities in citySlugMap (not in citiesData):', extraCities)
      }

      expect(extraCities).toEqual([])
      expect(extraCities.length).toBe(0)
    })

    it('should have exact match between both data sources', () => {
      const { cities } = useCities()
      const citiesDataNames = cities.map(c => c.name).sort()
      const slugMapCities = getAllCities().sort()

      expect(slugMapCities).toEqual(citiesDataNames)
    })
  })
})
