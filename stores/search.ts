import { defineStore } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

interface SearchState {
  type: 'car' | 'bus' | null
  from: string | null
  to: string | null
  date: string | null
  passengers: number
  searchResults: any[]
  ref: string | null
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    type: null,
    from: null,
    to: null,
    date: null,
    passengers: 1,
    searchResults: [],
    ref: null
  }),

  getters: {
    // Getter pour vérifier si une recherche est valide
    isValidSearch: (state): boolean => {
      if (state.type === 'bus') {
        return !!state.ref
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

    reset() {
      this.type = null
      this.from = null
      this.to = null
      this.date = null
      this.passengers = 1
      this.searchResults = []
      this.ref = null
    }
  },

  persist: true
})
