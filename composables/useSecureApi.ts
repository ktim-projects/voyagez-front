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

      console.log('response--', response);
      
      
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

  const searchBus = async (ref: string) => {
    return await secureApiFetch<ResponseBus>(`/api/bus/line-details?ref=${ref.trim()}`)
  }

  const subscribeNewsletter = async (email: string) => {
    return await secureApiFetch('/api/newsletter', {
      method: 'POST',
      body: { email }
    })
  }
  
  return {
    secureApiFetch,
    searchCars,
    searchBus,
    subscribeNewsletter
  }
}
