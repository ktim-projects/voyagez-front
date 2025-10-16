import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSecureApi, clearBusCache } from '~/composables/useSecureApi'

describe('useSecureApi', () => {
  beforeEach(() => {
    // Reset mocks avant chaque test
    vi.clearAllMocks()
    
    // Nettoyer le cache du bus
    clearBusCache()
    
    // Mock de useRuntimeConfig
    ;(global as any).useRuntimeConfig = vi.fn(() => ({
      public: {
        apiKeyFrontend: 'test-api-key'
      }
    }))
  })

  describe('secureApiFetch', () => {
    it('should add API key to requests', async () => {
      const mockResponse = { data: 'test' }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { secureApiFetch } = useSecureApi()
      const result = await secureApiFetch('/api/test')

      expect((global as any).$fetch).toHaveBeenCalledWith('/api/test', {
        headers: {
          'x-api-key': 'test-api-key'
        }
      })
      expect(result).toEqual(mockResponse)
    })

    it('should preserve existing headers', async () => {
      const mockResponse = { data: 'test' }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { secureApiFetch } = useSecureApi()
      await secureApiFetch('/api/test', {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      expect((global as any).$fetch).toHaveBeenCalledWith('/api/test', {
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json'
        }
      })
    })

    it('should handle 401 error (invalid API key)', async () => {
      const error = new Error('Unauthorized')
      ;(error as any).statusCode = 401
      ;(global as any).$fetch = vi.fn().mockRejectedValue(error)

      const { secureApiFetch } = useSecureApi()

      await expect(secureApiFetch('/api/test')).rejects.toThrow('Invalid or missing API key')
    })

    it('should handle 429 error (rate limiting)', async () => {
      const error = new Error('Too Many Requests')
      ;(error as any).statusCode = 429
      ;(global as any).$fetch = vi.fn().mockRejectedValue(error)

      const { secureApiFetch } = useSecureApi()

      await expect(secureApiFetch('/api/test')).rejects.toThrow('Too many requests, please wait')
    })

    it('should handle 400 error with malicious detection', async () => {
      const error = new Error('Bad Request')
      ;(error as any).statusCode = 400
      ;(error as any).statusMessage = 'Malicious request detected'
      ;(global as any).$fetch = vi.fn().mockRejectedValue(error)

      const { secureApiFetch } = useSecureApi()

      await expect(secureApiFetch('/api/test')).rejects.toThrow('Invalid request detected')
    })

    it('should rethrow other errors as-is', async () => {
      const error = new Error('Server Error')
      ;(error as any).statusCode = 500
      ;(global as any).$fetch = vi.fn().mockRejectedValue(error)

      const { secureApiFetch } = useSecureApi()

      await expect(secureApiFetch('/api/test')).rejects.toThrow('Server Error')
    })
  })

  describe('searchCars', () => {
    it('should call API with correct parameters', async () => {
      const mockResponse = {
        departures: [],
        _meta: { total: 0, page: 1, limit: 10 }
      }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { searchCars } = useSecureApi()
      const result = await searchCars({ from: 'abidjan', to: 'bouake' })

      expect((global as any).$fetch).toHaveBeenCalledWith('/api/car/search', {
        query: { from: 'abidjan', to: 'bouake' },
        headers: {
          'x-api-key': 'test-api-key'
        }
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('searchBus - Caching', () => {
    beforeEach(() => {
      // Reset du cache avant chaque test
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should cache bus search results', async () => {
      const mockResponse = {
        lineId: '81',
        lineTags: { ref: '81' },
        details: {}
      }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { searchBus } = useSecureApi()

      // Première recherche - appel API
      const result1 = await searchBus('81')
      expect((global as any).$fetch).toHaveBeenCalledTimes(1)
      expect(result1).toEqual(mockResponse)

      // Deuxième recherche - depuis le cache
      const result2 = await searchBus('81')
      expect((global as any).$fetch).toHaveBeenCalledTimes(1) // Toujours 1 seul appel
      expect(result2).toEqual(mockResponse)
    })

    it('should expire cache after 5 hours', async () => {
      const mockResponse = {
        lineId: '81',
        lineTags: { ref: '81' },
        details: {}
      }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { searchBus } = useSecureApi()

      // Première recherche
      await searchBus('81')
      expect((global as any).$fetch).toHaveBeenCalledTimes(1)

      // Avancer de 4 heures - cache toujours valide
      vi.advanceTimersByTime(4 * 60 * 60 * 1000)
      await searchBus('81')
      expect((global as any).$fetch).toHaveBeenCalledTimes(1)

      // Avancer de 2 heures supplémentaires (total 6h) - cache expiré
      vi.advanceTimersByTime(2 * 60 * 60 * 1000)
      await searchBus('81')
      expect((global as any).$fetch).toHaveBeenCalledTimes(2)
    })

    it('should trim spaces in ref parameter', async () => {
      const mockResponse = {
        lineId: '81',
        lineTags: { ref: '81' },
        details: {}
      }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { searchBus } = useSecureApi()

      await searchBus('  81  ')

      expect((global as any).$fetch).toHaveBeenCalledWith(
        '/api/bus/line-details?ref=81',
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key'
          })
        })
      )
    })

    it('should have different cache for each ref', async () => {
      const mockResponse81 = {
        lineId: '81',
        lineTags: { ref: '81' },
        details: {}
      }
      const mockResponse82 = {
        lineId: '82',
        lineTags: { ref: '82' },
        details: {}
      }
      
      ;(global as any).$fetch = vi.fn()
        .mockResolvedValueOnce(mockResponse81)
        .mockResolvedValueOnce(mockResponse82)

      const { searchBus } = useSecureApi()

      // Recherche bus 81
      const result1 = await searchBus('81')
      expect(result1.lineId).toBe('81')

      // Recherche bus 82 - nouvel appel API
      const result2 = await searchBus('82')
      expect(result2.lineId).toBe('82')

      expect((global as any).$fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('searchBus - Retry on timeout', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should automatically retry on 504 error (timeout)', async () => {
      const error504 = new Error('Gateway Timeout')
      ;(error504 as any).statusCode = 504

      const mockResponse = {
        lineId: '81',
        lineTags: { ref: '81' },
        details: {}
      }

      // Premier appel échoue, deuxième réussit
      ;(global as any).$fetch = vi.fn()
        .mockRejectedValueOnce(error504)
        .mockResolvedValueOnce(mockResponse)

      const { searchBus } = useSecureApi()

      // Lancer la recherche
      const promise = searchBus('81')

      // Avancer le timer pour le délai de retry (2 secondes)
      await vi.advanceTimersByTimeAsync(2000)

      const result = await promise

      expect((global as any).$fetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockResponse)
    })

    it('should retry up to 2 attempts maximum', async () => {
      const error504 = new Error('Gateway Timeout')
      ;(error504 as any).statusCode = 504

      ;(global as any).$fetch = vi.fn().mockRejectedValue(error504)

      const { searchBus } = useSecureApi()

      // Lancer la recherche et capturer l'erreur
      const promise = searchBus('81').catch(err => err)

      // Avancer pour les 2 retries
      await vi.advanceTimersByTimeAsync(2000) // 1er retry
      await vi.advanceTimersByTimeAsync(4000) // 2ème retry

      const result = await promise
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Gateway Timeout')
      expect((global as any).$fetch).toHaveBeenCalledTimes(2) // Tentative initiale + 1 retry
    })

    it('should not retry on 401 error', async () => {
      const error401 = new Error('Unauthorized')
      ;(error401 as any).statusCode = 401

      ;(global as any).$fetch = vi.fn().mockRejectedValue(error401)

      const { searchBus } = useSecureApi()

      await expect(searchBus('81')).rejects.toThrow('Invalid or missing API key')
      expect((global as any).$fetch).toHaveBeenCalledTimes(1) // Pas de retry
    })

    it('should not retry on 429 error', async () => {
      const error429 = new Error('Too Many Requests')
      ;(error429 as any).statusCode = 429

      ;(global as any).$fetch = vi.fn().mockRejectedValue(error429)

      const { searchBus } = useSecureApi()

      await expect(searchBus('81')).rejects.toThrow('Too many requests, please wait')
      expect((global as any).$fetch).toHaveBeenCalledTimes(1) // Pas de retry
    })

    it('should retry on 500 error', async () => {
      const error500 = new Error('Internal Server Error')
      ;(error500 as any).statusCode = 500

      const mockResponse = {
        lineId: '81',
        lineTags: { ref: '81' },
        details: {}
      }

      ;(global as any).$fetch = vi.fn()
        .mockRejectedValueOnce(error500)
        .mockResolvedValueOnce(mockResponse)

      const { searchBus } = useSecureApi()

      const promise = searchBus('81')
      await vi.advanceTimersByTimeAsync(2000)

      const result = await promise

      expect((global as any).$fetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('subscribeNewsletter', () => {
    it('should send POST request with email', async () => {
      const mockResponse = { success: true }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { subscribeNewsletter } = useSecureApi()
      const result = await subscribeNewsletter('test@example.com')

      expect((global as any).$fetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        body: { email: 'test@example.com' },
        headers: {
          'x-api-key': 'test-api-key'
        }
      })
      expect(result).toEqual(mockResponse)
    })
  })
})
