import L from 'leaflet';
import type { GeoJsonFeature } from '../models/line_data';

/**
 * Initialise et affiche une carte avec un itinéraire et ses arrêts
 * @param mapContainer Élément DOM où afficher la carte
 * @param routeShape GeoJSON de l'itinéraire
 * @param stopList Liste des arrêts
 * @param routeColor Couleur de l'itinéraire
 * @returns Instance de la carte Leaflet
 */
export function displayRouteMap(
  mapContainer: HTMLDivElement,
  routeShape: GeoJsonFeature,
  stopList: GeoJsonFeature[],
  routeColor: string = '#6C757D'
): L.Map {
  // Initialiser la carte
  const map = L.map(mapContainer).setView([5.3364, -4.0267], 12); // Coordonnées d'Abidjan

  // Ajouter la couche de tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.7
  }).addTo(map);

  // Ajouter l'échelle
  L.control.scale().addTo(map);

  // Paramètres de style pour l'itinéraire
  const lineWeight = 4;

  // Ajouter le contour de l'itinéraire (effet d'ombre)
  const routeOutline = L.geoJSON(routeShape as any, {
    style: {
      color: '#000',
      weight: lineWeight + 4,
      opacity: 0.5
    }
  }).addTo(map);

  // Ajouter le fond blanc de l'itinéraire
  const routeBackground = L.geoJSON(routeShape as any, {
    style: {
      color: '#fff',
      weight: lineWeight + 2,
      opacity: 1
    }
  }).addTo(map);

  // Ajouter l'itinéraire avec sa couleur
  const route = L.geoJSON(routeShape as any, {
    style: {
      color: routeColor,
      weight: lineWeight,
      opacity: 1
    }
  }).addTo(map);

  // Fonction pour ajouter un popup à chaque arrêt
  function addPopup(feature: any, layer: L.Layer) {
    const name = feature.properties?.name || 'Arrêt sans nom';
    const id = feature.id || '';
    layer.bindPopup(`
      <div class="stop-popup">
        <strong>${name}</strong>
        <a href="https://www.openstreetmap.org/${id}" target="_blank" class="text-xs text-blue-500 block mt-1">
          Voir sur OpenStreetMap
        </a>
      </div>
    `);
  }

  // Fonction pour personnaliser l'affichage des arrêts
  function displayStops(feature: any, latlng: L.LatLng) {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: '#fff',
      color: routeColor,
      weight: 2,
      opacity: 1,
      fillOpacity: 1
    });
  }

  // Ajouter les arrêts sur la carte
  const stops = L.geoJSON(stopList as any, {
    onEachFeature: addPopup,
    pointToLayer: displayStops
  }).addTo(map);

  // Ajuster la vue pour montrer tout l'itinéraire
  if (route.getBounds().isValid()) {
    map.fitBounds(route.getBounds());
  } else if (stops.getBounds().isValid()) {
    map.fitBounds(stops.getBounds());
  }

  return map;
}
