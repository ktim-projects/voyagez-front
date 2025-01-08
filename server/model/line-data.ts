import osmtogeojson from 'osmtogeojson';

// Types pour la structure des données
interface LineData {
  data_last_check: string;
  line_tags: Record<string, string>;
  trips: Trip[];
}

interface Trip {
  id: string;
  tags: Record<string, string>;
  shape: GeoJSONFeature;
  stop_list: GeoJSONFeature[];
}

interface GeoJSONFeature {
  type: string;
  id: string;
  geometry: {
      type: string;
      coordinates: number[][] | number[][][];
  };
  properties: Record<string, any>;
}

interface OverpassResponse {
  osm3s: {
      timestamp_osm_base: string;
  };
  elements: Array<{
      type: string;
      id: number;
      tags?: Record<string, string>;
      members?: Array<{
          type: string;
          ref: number;
          role: string;
      }>;
  }>;
}

 class TransportLine {
  private data_last_check: string;
  private line_tags: Record<string, string>;
  private trips: Trip[];

  constructor() {
      this.data_last_check = '';
      this.line_tags = {};
      this.trips = [];
  }

  /**
   * Retourne l'âge des données
   */
  public getDataAge(): string {
      return this.data_last_check;
  }

  /**
   * Retourne le nombre de trajets
   */
  public getTripsNumber(): number {
      return this.trips.length;
  }

  /**
   * Retourne les tags de la ligne
   */
  public getTags(): Record<string, string> {
      return this.line_tags;
  }

  /**
   * Retourne tous les trajets
   */
  public getTrips(): Trip[] {
      return this.trips;
  }

  /**
   * Initialise les données depuis Overpass
   * @param lineId - L'identifiant de la ligne à récupérer
   * @returns Un statut indiquant le résultat de l'opération
   */
  public async initFromOverpass(lineId: string): Promise<string> {
    console.log('lineId', typeof lineId);
    
      try {
          const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];relation(${lineId});(._;>>;);out;`;
          const overpassResponse = await fetch(overpassUrl);
          const overpassData: OverpassResponse = await overpassResponse.json();

          this.data_last_check = overpassData.osm3s.timestamp_osm_base;

          // Extraction et restructuration des données Overpass
          const otherRelations: Record<number, any> = {};
          let relation;

          console.log('overpassData.elements', overpassData.elements);
          

          for (const element of overpassData.elements) {
              if (element.id.toString() === lineId.toString()) {
                  relation = element;
                  this.line_tags = element.tags || {};
              } else if (element.type === "relation") {
                  otherRelations[element.id] = element;
              }
          }

          if (!relation) {
              return "Relation non trouvée";
          }

          if (this.line_tags['type'] === 'route') {
              return "Ce n'est pas une ligne de transport en commun, c'est un trajet. Essayez avec sa relation parente";
          } else if (this.line_tags['type'] !== 'route_master') {
              return "Ce n'est pas une ligne de transport en commun";
          }

          // Conversion des données en GeoJSON et extraction des informations des trajets
          const dataAsGeojson = osmtogeojson(overpassData);
          this.trips = [];

          for (const member of relation.members || []) {
              const routeId = member.ref;
              const route = otherRelations[routeId];
              
              if (!route) continue;

              const geojsonElems: Record<string, GeoJSONFeature> = {};
              let geojsonFeature: GeoJSONFeature | undefined;

              for (const feature of dataAsGeojson.features) {
                  if (feature.id === `relation/${routeId}`) {
                      geojsonFeature = feature;
                  } else {
                      geojsonElems[feature.id] = feature;
                  }
              }

              if (!geojsonFeature) continue;

              const platformListAsGeojson = route.members
                  ?.filter(m => m.role.startsWith("platform"))
                  .map(m => geojsonElems[`${m.type}/${m.ref}`])
                  .filter(Boolean) || [];

              const stopPositionListAsGeojson = route.members
                  ?.filter(m => m.role.startsWith("stop"))
                  .map(m => geojsonElems[`${m.type}/${m.ref}`])
                  .filter(Boolean) || [];

              const mode = route.tags?.route;
              const stopListAsGeojson = ["subway", "tram", "train", "railway"].includes(mode)
                  ? stopPositionListAsGeojson
                  : platformListAsGeojson;

              this.trips.push({
                  id: routeId.toString(),
                  tags: route.tags || {},
                  shape: geojsonFeature,
                  stop_list: stopListAsGeojson
              });
          }

          return "ok";

      } catch (error) {
          console.error(error);
          return "Une erreur s'est produite";
      }
  }
}

export default TransportLine;