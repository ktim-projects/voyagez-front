import { defineEventHandler, getQuery, createError, setHeaders } from 'h3'

interface OverpassResponse {
  elements: any[]
  osm3s: {
    timestamp_osm_base: string
  }
  timestamp_osm_base: string
}

export default defineEventHandler(async (event) => {
  // Get the lineId from query parameters
  const query = getQuery(event)
  const lineId = query.lineId

  // Validate lineId
  if (!lineId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing lineId parameter'
    })
  }

  try {
    // Détection automatique de l'environnement et configuration du cache en conséquence
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      // En développement, désactiver la mise en cache
      setHeaders(event, {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    } else {
      // En production, activer la mise en cache (24 heures)
      setHeaders(event, {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
      });
    }

    // Construct the Overpass API URL
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];relation(${lineId});(._;>>;);out;`
    
    // Fetch data from Overpass API
    const response = await fetch(overpassUrl)
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Error fetching data from Overpass API: ${response.statusText}`
      })
    }
    
    // Parse the response
    const data: OverpassResponse = await response.json()
    
    // Return the data
    return data
  } catch (error: any) {
    console.error('Error in line-data API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
