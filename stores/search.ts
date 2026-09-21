import { defineStore } from 'pinia'

interface SearchState {
  from: string | null
  to: string | null
  date: string | null
  passengers: number
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    from: null,
    to: null,
    date: null,
    passengers: 1
  }),

  getters: {
    // Getter pour vérifier si une recherche est valide
    isValidSearch: (state): boolean => {
      return !!(state.from && state.to)
    }
  },

  actions: {
    setSearchParams(params: Partial<SearchState>) {
      Object.assign(this, params)
    },

    reset() {
      this.from = null
      this.to = null
      this.date = null
      this.passengers = 1
    }
  },

  persist: true
})
