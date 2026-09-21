import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSecureApi } from '~/composables/useSecureApi'

describe('useSecureApi', () => {
  beforeEach(() => {
    // Reset mocks avant chaque test
    vi.clearAllMocks()
    
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

  describe('subscribeNewsletter', () => {
    it('should send POST request with email and default source', async () => {
      const mockResponse = { success: true, message: 'Successfully subscribed to newsletter' }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { subscribeNewsletter } = useSecureApi()
      const result = await subscribeNewsletter('test@example.com')

      expect((global as any).$fetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        body: { 
          email: 'test@example.com',
          source: 'homepage'
        },
        headers: {
          'x-api-key': 'test-api-key'
        }
      })
      expect(result).toEqual(mockResponse)
    })

    it('should send POST request with email and custom source', async () => {
      const mockResponse = { success: true, message: 'Successfully subscribed to newsletter' }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { subscribeNewsletter } = useSecureApi()
      const result = await subscribeNewsletter('test@example.com', 'footer')

      expect((global as any).$fetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        body: { 
          email: 'test@example.com',
          source: 'footer'
        },
        headers: {
          'x-api-key': 'test-api-key'
        }
      })
      expect(result).toEqual(mockResponse)
    })

    it('should trim email before sending', async () => {
      const mockResponse = { success: true, message: 'Successfully subscribed to newsletter' }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { subscribeNewsletter } = useSecureApi()
      await subscribeNewsletter('  test@example.com  ')

      expect((global as any).$fetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        body: { 
          email: 'test@example.com',
          source: 'homepage'
        },
        headers: {
          'x-api-key': 'test-api-key'
        }
      })
    })

    it('should handle email already subscribed error', async () => {
      const errorResponse = {
        statusCode: 409,
        data: { success: false, message: 'Email already subscribed' }
      }
      ;(global as any).$fetch = vi.fn().mockRejectedValue(errorResponse)

      const { subscribeNewsletter } = useSecureApi()

      await expect(subscribeNewsletter('test@example.com')).rejects.toEqual(errorResponse)
    })

    it('should handle invalid email error', async () => {
      const errorResponse = {
        statusCode: 400,
        data: { success: false, message: 'Invalid email format' }
      }
      ;(global as any).$fetch = vi.fn().mockRejectedValue(errorResponse)

      const { subscribeNewsletter } = useSecureApi()

      await expect(subscribeNewsletter('invalid-email')).rejects.toEqual(errorResponse)
    })
  })

  describe('sendContactMessage', () => {
    it('should send POST request with contact data', async () => {
      const mockResponse = { success: true, message: 'Message sent successfully' }
      ;(global as any).$fetch = vi.fn().mockResolvedValue(mockResponse)

      const { sendContactMessage } = useSecureApi()
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'general',
        message: 'Hello, I have a question...'
      }
      const result = await sendContactMessage(contactData)

      expect((global as any).$fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        body: contactData,
        headers: {
          'x-api-key': 'test-api-key'
        }
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle pending message error', async () => {
      const errorResponse = {
        statusCode: 409,
        data: { success: false, message: 'You already have a pending message. Please wait for a response before sending another one.' }
      }
      ;(global as any).$fetch = vi.fn().mockRejectedValue(errorResponse)

      const { sendContactMessage } = useSecureApi()
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'support',
        message: 'Another message'
      }

      await expect(sendContactMessage(contactData)).rejects.toEqual(errorResponse)
    })

    it('should handle validation errors', async () => {
      const errorResponse = {
        statusCode: 400,
        data: { success: false, message: 'All fields are required' }
      }
      ;(global as any).$fetch = vi.fn().mockRejectedValue(errorResponse)

      const { sendContactMessage } = useSecureApi()
      const contactData = {
        name: '',
        email: 'john@example.com',
        subject: 'general',
        message: ''
      }

      await expect(sendContactMessage(contactData)).rejects.toEqual(errorResponse)
    })
  })
})
