import { defineEventHandler, getQuery, createError, setHeaders } from 'h3'

interface OverpassElement {
  id: number;
  type: string;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
  osm3s: {
    timestamp_osm_base: string;
  };
  timestamp_osm_base: string;
}

export default defineEventHandler(async (event) => {
  // Récupération des paramètres de la requête
  const { ref } = getQuery(event);
  
  if (!ref) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameter: ref'
    });
  }

  // Formater le numéro de ligne (ajouter un 0 devant si c'est un chiffre entre 1 et 9)
  const formattedRef = /^[1-9]$/.test(ref.toString()) ? `0${ref}` : ref;

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

    // Étape 1: Trouver l'ID de la ligne avec le numéro de référence
    const network = 'SOTRA'; // Valeur fixe pour le réseau
    let lineSearchUrl = `https://overpass-api.de/api/interpreter?data=[out:json];relation[type=route_master]`;
    lineSearchUrl += `[~"network|operator"~"${network}",i]`;
    lineSearchUrl += `["ref"~"^${formattedRef}$",i]`;
    lineSearchUrl += `;out tags;`;
    
    const lineResponse = await fetch(lineSearchUrl);
    
    if (!lineResponse.ok) {
      throw createError({
        statusCode: lineResponse.status,
        statusMessage: `Error fetching line data: ${lineResponse.statusText}`
      });
    }
    
    const lineData: OverpassResponse = await lineResponse.json();
    
    if (!lineData.elements || lineData.elements.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `No line found with ref: ${ref}`
      });
    }
    
    const lineId = lineData.elements[0].id;
    const lineTags = lineData.elements[0].tags || {};
    
    // Étape 2: Récupérer les données détaillées de la ligne avec l'ID
    const detailsUrl = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];relation(${lineId});(._;>>;);out;`;
    
    const detailsResponse = await fetch(detailsUrl);
    
    if (!detailsResponse.ok) {
      throw createError({
        statusCode: detailsResponse.status,
        statusMessage: `Error fetching line details: ${detailsResponse.statusText}`
      });
    }
    
    const detailsData: OverpassResponse = await detailsResponse.json();
    
    // Retourner les données combinées
    return {
      lineId,
      lineTags,
      details: detailsData
    };
    
  } catch (error: any) {
    console.error('Error in line-details API:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal server error'
    });
  }
});
