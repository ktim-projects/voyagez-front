import { defineStore } from 'pinia'

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

  actions: {
    setSearchParams(params: Partial<SearchState>) {
      Object.assign(this, params)
    },

    setResults(results: any[]) {
      this.searchResults = results
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
