import { defineStore } from 'pinia'

interface SearchState {
  type: 'car' | 'bus' | null
  from: any | null
  to: any | null
  date: string | null
  passengers: number
  searchResults: any[]
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    type: null,
    from: null,
    to: null,
    date: null,
    passengers: 1,
    searchResults: []
  }),

  actions: {
    setSearchParams(params: Partial<SearchState>) {
      Object.assign(this, params)
    },

    setResults(results: any[]) {
      this.searchResults = results
    },

    clearSearch() {
      this.type = null
      this.from = null
      this.to = null
      this.date = null
      this.passengers = 1
      this.searchResults = []
    }
  },

  persist: true
})
