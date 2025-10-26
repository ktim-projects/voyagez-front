import type { Departure } from "~/server/data";

type ResponseCar = {
  departures: Departure[];
  _meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export type ResponseBus = {
  lineId: string;
  lineTags: Record<string, string>;
  details: any;
}

// Cache simple en mémoire pour les recherches de bus
const busCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 60 * 1000 // 5 heures en millisecondes

// Fonction pour nettoyer le cache (utile pour les tests)
export const clearBusCache = () => {
  busCache.clear()
}

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
    return await secureApiFetch<ResponseCar>('/api/car/search', {
      query: searchParams
    })
  }


  const searchBus = async (ref: string): Promise<ResponseBus> => {
    const cacheKey = `bus-${ref.trim()}`
    const now = Date.now()
    
    const cached = busCache.get(cacheKey)
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return cached.data
    }
    
    // Système de retry pour les timeouts
    let lastError: any
    const maxRetries = 2
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const data = await secureApiFetch<ResponseBus>(`/api/bus/line-details?ref=${ref.trim()}`)
        
        // Mettre en cache seulement si succès
        busCache.set(cacheKey, { data, timestamp: now })
        
        return data
      } catch (error: any) {
        lastError = error
        
        // Retry seulement pour les timeouts (504) et erreurs serveur (5xx)
        if (attempt < maxRetries && (error.statusCode === 504 || (error.statusCode >= 500 && error.statusCode < 600))) {
          console.warn(`Attempt ${attempt} failed, retrying in ${attempt * 2} seconds...`)
          await new Promise(resolve => setTimeout(resolve, attempt * 2000))
          continue
        }
        
        // Si ce n'est pas une erreur retry-able ou si on a épuisé les tentatives
        break
      }
    }
    
    // Relancer la dernière erreur
    throw lastError
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
  
  return {
    secureApiFetch,
    searchCars,
    searchBus,
    subscribeNewsletter,
    sendContactMessage
  }
}
