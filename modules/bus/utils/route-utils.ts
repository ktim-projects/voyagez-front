import type { Trip, GeoJsonFeature } from '../models/line_data';

/**
 * Récupère la liste des arrêts pour un itinéraire
 * @param stopList Liste des arrêts de l'itinéraire
 * @returns Liste des arrêts formatée
 */
export function getStopListForRoute(stopList: GeoJsonFeature[]): {
  id: string | number | undefined;
  name: string;
  coordinates: [number, number] | null;
}[] {
  if (!stopList || !stopList.length) {
    return [];
  }

  return stopList.map(stop => {
    // Extraire les coordonnées si disponibles
    let coordinates: [number, number] | null = null;
    if (stop.geometry && stop.geometry.type === 'Point' && stop.geometry.coordinates) {
      coordinates = [
        stop.geometry.coordinates[0],
        stop.geometry.coordinates[1]
      ];
    }

    return {
      id: stop.id,
      name: stop.properties?.name || 'Arrêt sans nom',
      coordinates
    };
  });
}

/**
 * Récupère les informations sur un itinéraire
 * @param trip Objet Trip contenant les informations de l'itinéraire
 * @returns Informations formatées sur l'itinéraire
 */
export function getRouteInfo(trip: Trip): {
  id: number;
  name: string;
  color: string;
  stops: {
    id: string | number | undefined;
    name: string;
    coordinates: [number, number] | null;
  }[];
  shape: GeoJsonFeature;
  duration?: number;
  isExpress: boolean;
} {
  // Récupérer la couleur de l'itinéraire ou utiliser une couleur par défaut
  const color = trip.tags?.colour || '#6C757D';
  
  // Récupérer le nom de l'itinéraire
  const name = trip.tags?.name || `Ligne ${trip.tags?.ref || trip.id}`;
  
  // Récupérer la liste des arrêts
  const stops = getStopListForRoute(trip.stop_list);
  
  // Récupérer la durée du trajet (en minutes)
  const duration = trip.tags?.duration ? parseInt(trip.tags.duration) : undefined;
  
  // Vérifier si c'est un bus express
  const isExpress = trip.tags?.network === 'Express';
  
  return {
    id: trip.id,
    name,
    color,
    stops,
    shape: trip.shape,
    duration,
    isExpress
  };
}

/**
 * Récupère les informations sur tous les itinéraires d'une ligne
 * @param trips Liste des itinéraires
 * @returns Informations formatées sur tous les itinéraires
 */
export function getAllRoutesInfo(trips: Trip[]): {
  id: number;
  name: string;
  color: string;
  stops: {
    id: string | number | undefined;
    name: string;
    coordinates: [number, number] | null;
  }[];
  shape: GeoJsonFeature;
  duration?: number;
  isExpress: boolean;
}[] {
  if (!trips || !trips.length) {
    return [];
  }
  
  return trips.map(trip => getRouteInfo(trip));
}
