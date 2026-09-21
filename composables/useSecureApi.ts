import type { Departure } from "~/server/data";

type ResponseCar = {
  departures: Departure[];
  _meta: {
    total: number;
    page: number;
    limit: number;
  };
};

/**
 * Appels vers les routes /api/ du site.
 *
 * Aucune clé d'API n'est envoyée depuis le navigateur : elle serait de toute
 * façon lisible dans le bundle. Le serveur identifie les requêtes du site via
 * leur origine (cf. server/middleware/security.ts).
 */
export const useSecureApi = () => {
  const secureApiFetch = async <T>(url: string, options: Record<string, unknown> = {}): Promise<T> => {
    try {
      return await $fetch<T>(url, options)
    } catch (error) {
      const { statusCode, statusMessage } = error as { statusCode?: number; statusMessage?: string }

      if (statusCode === 403) {
        throw new Error('Request rejected', { cause: error })
      } else if (statusCode === 429) {
        throw new Error('Too many requests, please wait', { cause: error })
      } else if (statusCode === 400 && statusMessage?.includes('Malicious')) {
        throw new Error('Invalid request detected', { cause: error })
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
