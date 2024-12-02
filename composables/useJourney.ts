import { defineStore } from 'pinia';

interface Journey {
  id: string;
  operator: string;
  operatorLogo: string;
  type: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
}

export const useJourneyStore = defineStore('journey', {
  state: () => ({
    journeys: [] as Journey[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchJourneys(params: any) {
      this.loading = true;
      this.error = null;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        this.journeys = [
          {
            id: '1',
            operator: 'SNCF',
            operatorLogo: '/images/sncf-logo.png',
            type: 'Train',
            origin: params.from,
            destination: params.to,
            departureTime: '09:00',
            arrivalTime: '11:30',
            duration: '2h 30m',
            stops: 1,
            price: 45
          },
          {
            id: '2',
            operator: 'FlixBus',
            operatorLogo: '/images/flixbus-logo.png',
            type: 'Bus',
            origin: params.from,
            destination: params.to,
            departureTime: '08:30',
            arrivalTime: '12:00',
            duration: '3h 30m',
            stops: 2,
            price: 25
          }
        ];
      } catch (error) {
        this.error = 'Failed to fetch journeys';
        console.error('Error fetching journeys:', error);
      } finally {
        this.loading = false;
      }
    },

    async getJourneyById(id: string): Promise<Journey | null> {
      return this.journeys.find(journey => journey.id === id) || null;
    }
  }
});