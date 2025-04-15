import { defineEventHandler, getQuery, createError, setHeaders } from 'h3'

interface OverpassResponse {
  elements: OverpassElement[]
  osm3s: {
    timestamp_osm_base: string
  }
  timestamp_osm_base: string
}

interface OverpassElement {
  id: number;
  type: string;
  tags?: Record<string, string>;
}

export default defineEventHandler(async (event) => {
  // Get the ref from query parameters
  const query = getQuery(event)
  const ref = query.ref

  // Validate ref parameter
  if (!ref) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing ref parameter'
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

    // Construct the Overpass API URL with SOTRA as the fixed network value
    const network = 'SOTRA' // Fixed network value
    let overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];relation[type=route_master]`
    
    // Add network filter (hardcoded to SOTRA)
    overpassUrl += `[~"network|operator"~"${network}",i]`
    
    // Add ref filter (required parameter)
    overpassUrl += `["ref"~"^${ref}$",i]`
    
    // Complete the query
    overpassUrl += `;out tags;`
    
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

    const {id, ...lineData} = data.elements[0]

    console.log('lineData', id, lineData);
    
    // Return the data
    return {id, ...lineData}
  } catch (error: any) {
    console.error('Error in line API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})
