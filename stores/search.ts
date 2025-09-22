import { defineStore } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

interface SearchState {
  type: 'car' | 'bus' | null
  from: string | null
  to: string | null
  date: string | null
  passengers: number
  searchResults: any[]
  busNumber: string | null
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    type: null,
    from: null,
    to: null,
    date: null,
    passengers: 1,
    searchResults: [],
    busNumber: null
  }),

  getters: {
    // Getter pour construire les query params à partir de l'état
    queryParams: (state): Record<string, string> => {
      const params: Record<string, string> = {}
      
      if (state.type) params.type = state.type
      if (state.from) params.from = state.from
      if (state.to) params.to = state.to
      if (state.date) params.date = state.date
      if (state.passengers !== 1) params.passengers = state.passengers.toString()
      if (state.busNumber) params.busNumber = state.busNumber
      
      return params
    },

    // Getter pour vérifier si une recherche est valide
    isValidSearch: (state): boolean => {
      if (state.type === 'bus') {
        return !!state.busNumber
      }
      return !!(state.from && state.to)
    }
  },

  actions: {
    setSearchParams(params: Partial<SearchState>) {
      Object.assign(this, params)
    },

    setResults(results: any[]) {
      this.searchResults = results
    },

    // Nouvelle action pour synchroniser avec les query params
    syncFromQueryParams(queryParams: Record<string, string | string[]>) {
      if (queryParams.type && ['car', 'bus'].includes(queryParams.type as string)) {
        this.type = queryParams.type as 'car' | 'bus'
      }
      if (queryParams.from && typeof queryParams.from === 'string') {
        this.from = queryParams.from
      }
      if (queryParams.to && typeof queryParams.to === 'string') {
        this.to = queryParams.to
      }
      if (queryParams.date && typeof queryParams.date === 'string') {
        this.date = queryParams.date
      }
      if (queryParams.passengers && typeof queryParams.passengers === 'string') {
        const passengers = parseInt(queryParams.passengers)
        if (!isNaN(passengers) && passengers > 0) {
          this.passengers = passengers
        }
      }
      if (queryParams.busNumber && typeof queryParams.busNumber === 'string') {
        this.busNumber = queryParams.busNumber
      }
    },

    // Méthode helper pour obtenir les query params
    getQueryParams(): Record<string, string> {
      const params: Record<string, string> = {}
      
      if (this.type) params.type = this.type
      if (this.from) params.from = this.from
      if (this.to) params.to = this.to
      if (this.date) params.date = this.date
      if (this.passengers !== 1) params.passengers = this.passengers.toString()
      if (this.busNumber) params.busNumber = this.busNumber
      
      return params
    },

    reset() {
      this.type = null
      this.from = null
      this.to = null
      this.date = null
      this.passengers = 1
      this.searchResults = []
      this.busNumber = null
    }
  },

  persist: true
})
