import type { Departure } from "~/server/data";

type ResponseCar = {
  departures: Departure[];
  _meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export const useSecureApi = () => {
  const config = useRuntimeConfig()
  
  const secureApiFetch = async <T>(url: string, options: any = {}): Promise<T> => {
    const headers = {
      'x-api-key': config.public.apiKeyFrontend,
      ...options.headers
    }
    
    try {
      const response = await $fetch<T>(url, {
        ...options,
        headers
      })

      return response
    } catch (error: any) {
      if (error.statusCode === 401) {
        console.error('🔐 Error API key')
        throw new Error('Invalid or missing API key')
      } else if (error.statusCode === 429) {
        console.error('🚫 Rate limit exceeded')
        throw new Error('Too many requests, please wait')
      } else if (error.statusCode === 400 && error.statusMessage?.includes('Malicious')) {
        console.error('🛡️ Security violation detected')
        throw new Error('Invalid request detected')
      }
      
      throw error
    }
  }

  
  const searchCars = async (searchParams: any) => {
    // Filtrer les paramètres vides pour nettoyer l'URL
    const cleanParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
      // Garder seulement les valeurs non vides
      if (value !== '' && value !== null && value !== undefined) {
        // Pour les tableaux, garder seulement s'ils ne sont pas vides
        if (Array.isArray(value)) {
          if (value.length > 0) {
            acc[key] = value;
          }
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    return await secureApiFetch<ResponseCar>('/api/car/search', {
      query: cleanParams
    })
  }


  const subscribeNewsletter = async (email: string, source: string = 'homepage') => {
    return await secureApiFetch('/api/newsletter', {
      method: 'POST',
      body: { 
        email: email.trim(),
        source 
      }
    })
  }

  const sendContactMessage = async (data: { name: string; email: string; subject: string; message: string }) => {
    return await secureApiFetch('/api/contact', {
      method: 'POST',
      body: data
    })
  }

  const getArticles = async (params?: { page?: number; limit?: number; category?: string; tag?: string }) => {
    return await secureApiFetch('/api/articles', {
      query: params || {}
    })
  }

  const getArticleBySlug = async (slug: string) => {
    return await secureApiFetch(`/api/articles/${slug}`)
  }
  
  return {
    secureApiFetch,
    searchCars,
    subscribeNewsletter,
    sendContactMessage,
    getArticles,
    getArticleBySlug
  }
}
