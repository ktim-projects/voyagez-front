/**
 * This module is part of Unroll tool by Jungle Bus.
 * It gets structured data about a public transport line by its id
 * needs osmtogeojson (from https://github.com/tyrasd/osmtogeojson)
 */

import osmtogeojson from 'osmtogeojson';

// Type definitions
export interface LineTags {
    [key: string]: string;
  }
  
  export interface Member {
    type: string;
    ref: number;
    role: string;
  }
  
  export interface Relation {
    id: number;
    tags: LineTags;
    members: Member[];
  }
  
  export interface GeoJsonFeature {
    id: string | number | undefined;
    type: string;
    geometry: any;
    properties: any;
  }
  
  export interface Trip {
    id: number;
    tags: LineTags;
    shape: GeoJsonFeature;
    stop_list: GeoJsonFeature[];
  }
  
  export interface OverpassElement {
    id: number;
    type: string;
    tags?: LineTags;
    members?: Member[];
    lat?: number;
    lon?: number;
  }
  
  export interface OverpassResponse {
    elements: OverpassElement[];
    osm3s: {
      timestamp_osm_base: string;
    };
  }
  
  /**
   * LineData class for fetching and processing public transport line data
   */
  export class LineData {
    private dataLastCheck: string | null = null;
    private lineTags: LineTags | null = null;
    private trips: Trip[] = [];
  
    /**
     * Get the timestamp of when the data was last checked
     */
    getDataAge(): string | null {
      return this.dataLastCheck;
    }
  
    /**
     * Get the number of trips
     */
    getTripsNumber(): number {
      return this.trips.length;
    }
  
    /**
     * Get line tags
     */
    getTags(): LineTags | null {
      return this.lineTags;
    }
  
    /**
     * Get all trips
     */
    getTrips(): Trip[] {
      return this.trips;
    }
  
    /**
     * Initialize from already fetched Overpass data
     * @param overpassData The Overpass data
     * @param lineId The ID of the line
     * @returns Status message
     */
    initFromData(overpassData: OverpassResponse, lineId: number): string {
      try {
        this.dataLastCheck = overpassData.osm3s.timestamp_osm_base;
        
        // Reset trips
        this.trips = [];
        
        // Extract tags and re-structure Overpass response
        const otherRelations: Record<number, OverpassElement> = {};
        let relation: OverpassElement | null = null;
        
        for (const element of overpassData.elements) {
          if (element.id === lineId) {
            relation = element;
            this.lineTags = element.tags || {};
          } else if (element.type === "relation") {
            otherRelations[element.id] = element;
          }
        }
        
        if (!relation) {
          return "Line not found";
        } else if (!this.lineTags) {
          return "No tags found for this line";
        } else if (this.lineTags.type !== 'route_master') {
          return "This is not a public transport line";
        }
  
        // Extract trips info, and convert stops and shapes to geojson
        const dataAsGeojson = osmtogeojson(overpassData);
        
        if (!relation.members) {
          return "No members found in relation";
        }
  
        // Process each route in the route_master
        for (const member of relation.members) {
          if (member.type !== "relation") {
            continue;
          }
          
          const routeId = member.ref;
          const routeRelation = otherRelations[routeId];
          
          if (!routeRelation || !routeRelation.tags) {
            continue;
          }
          
          // Create a trip
          const trip: Trip = {
            id: routeId,
            tags: routeRelation.tags,
            shape: {} as GeoJsonFeature,
            stop_list: []
          };
          
          // Find the shape in the geojson
          let geojsonFeature: GeoJsonFeature | null = null;
          const geojsonElems: Record<string, GeoJsonFeature> = {};
          
          for (const feature of dataAsGeojson.features) {
            if (feature.id === `relation/${routeId}`) {
              geojsonFeature = feature as GeoJsonFeature;
            } else if (feature.id !== undefined) {
              geojsonElems[String(feature.id)] = feature as GeoJsonFeature;
            }
          }
  
          if (!geojsonFeature) {
            continue;
          }
          
          trip.shape = geojsonFeature;
          
          // Find the stops
          if (!routeRelation.members) {
            continue;
          }
          
          for (const routeMember of routeRelation.members) {
            if (routeMember.role === "stop" || routeMember.role === "platform") {
              const stopId = `node/${routeMember.ref}`;
              if (geojsonElems[stopId]) {
                trip.stop_list.push(geojsonElems[stopId]);
              }
            }
          }
          
          this.trips.push(trip);
        }
        
        return "OK";
      } catch (error) {
        console.error("Error processing Overpass data:", error);
        return "Error processing Overpass data";
      }
    }
  
    /**
     * Fetch and process data from Overpass API
     * @param lineId The ID of the line to fetch
     * @returns Status message
     */
    async initFromOverpass(lineId: number): Promise<string> {
      try {
        // Utiliser l'API serveur Nuxt au lieu d'appeler directement l'API Overpass
        const response = await fetch(`/api/bus/line-data?lineId=${lineId}`);
        if (!response.ok) {
          throw new Error(`Error fetching line data: ${response.statusText}`);
        }
        const overpassData: OverpassResponse = await response.json();

        this.dataLastCheck = overpassData.osm3s.timestamp_osm_base;
        
        // Reset trips
        this.trips = [];
        
        // Extract tags and re-structure Overpass response
        const otherRelations: Record<number, OverpassElement> = {};
        let relation: OverpassElement | null = null;
        
        for (const element of overpassData.elements) {
          if (element.id === lineId) {
            relation = element;
            this.lineTags = element.tags || {};
          } else if (element.type === "relation") {
            otherRelations[element.id] = element;
          }
        }
  
        if (!relation || !this.lineTags) {
          return "Relation not found";
        }
        
        if (this.lineTags.type === 'route') {
          return "This is not a public transport line, it is a trip. Try again using its parent relation";
        } else if (this.lineTags.type !== 'route_master') {
          return "This is not a public transport line";
        }
  
        // Extract trips info, and convert stops and shapes to geojson
        const dataAsGeojson = osmtogeojson(overpassData);
        
        if (!relation.members) {
          return "No members found in relation";
        }
  
        for (const member of relation.members) {
          const routeId = member.ref;
          const route = otherRelations[routeId];
          
          if (!route || !route.members || !route.tags) {
            continue;
          }
  
          const geojsonElems: Record<string, GeoJsonFeature> = {};
          let geojsonFeature: GeoJsonFeature | null = null;
          
          for (const feature of dataAsGeojson.features) {
            if (feature.id === `relation/${routeId}`) {
              geojsonFeature = feature as GeoJsonFeature;
            } else if (feature.id !== undefined) {
              geojsonElems[String(feature.id)] = feature as GeoJsonFeature;
            }
          }
  
          if (!geojsonFeature) {
            continue;
          }
  
          const platformListAsGeojson: GeoJsonFeature[] = [];
          route.members
            .filter(member => member.role.startsWith("platform"))
            .forEach(member => {
              const key = `${member.type}/${member.ref}`;
              if (geojsonElems[key]) {
                platformListAsGeojson.push(geojsonElems[key]);
              }
            });
          
          const stopPositionListAsGeojson: GeoJsonFeature[] = [];
          route.members
            .filter(member => member.role.startsWith("stop"))
            .forEach(member => {
              const key = `${member.type}/${member.ref}`;
              if (geojsonElems[key]) {
                stopPositionListAsGeojson.push(geojsonElems[key]);
              }
            });
          
          const mode = route.tags.route;
          const stopListAsGeojson = ["subway", "tram", "train", "railway"].includes(mode)
            ? stopPositionListAsGeojson
            : platformListAsGeojson;
  
          this.trips.push({
            id: routeId,
            tags: route.tags,
            shape: geojsonFeature,
            stop_list: stopListAsGeojson,
          });
        }
        
        return "ok";
  
      } catch (error) {
        console.error(error);
        return "Oops, something went wrong";
      }
    }
  }