import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from '~/stores/search'

describe('useSearchStore', () => {
  beforeEach(() => {
    // Créer une nouvelle instance Pinia avant chaque test
    setActivePinia(createPinia())
  })

  describe('Initial state', () => {
    it('should initialize with default values', () => {
      const store = useSearchStore()

      expect(store.type).toBeNull()
      expect(store.from).toBeNull()
      expect(store.to).toBeNull()
      expect(store.date).toBeNull()
      expect(store.passengers).toBe(1)
      expect(store.searchResults).toEqual([])
      expect(store.ref).toBeNull()
    })
  })

  describe('setSearchParams', () => {
    it('should update car search parameters', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké',
        date: '2024-01-15',
        passengers: 2
      })

      expect(store.type).toBe('car')
      expect(store.from).toBe('Abidjan')
      expect(store.to).toBe('Bouaké')
      expect(store.date).toBe('2024-01-15')
      expect(store.passengers).toBe(2)
    })

    it('should update bus search parameters', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'bus',
        ref: '81'
      })

      expect(store.type).toBe('bus')
      expect(store.ref).toBe('81')
    })

    it('should partially update parameters', () => {
      const store = useSearchStore()

      // Initialiser avec des valeurs
      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké'
      })

      // Mettre à jour seulement certains champs
      store.setSearchParams({
        passengers: 3
      })

      expect(store.type).toBe('car')
      expect(store.from).toBe('Abidjan')
      expect(store.to).toBe('Bouaké')
      expect(store.passengers).toBe(3)
    })

    it('should accept null as value', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké'
      })

      store.setSearchParams({
        from: null
      })

      expect(store.from).toBeNull()
      expect(store.to).toBe('Bouaké')
    })
  })

  describe('setResults', () => {
    it('should update search results', () => {
      const store = useSearchStore()
      const mockResults = [
        { id: 1, company: 'UTB' },
        { id: 2, company: 'STB' }
      ]

      store.setResults(mockResults)

      expect(store.searchResults).toEqual(mockResults)
      expect(store.searchResults).toHaveLength(2)
    })

    it('should replace existing results', () => {
      const store = useSearchStore()

      store.setResults([{ id: 1 }])
      expect(store.searchResults).toHaveLength(1)

      store.setResults([{ id: 2 }, { id: 3 }])
      expect(store.searchResults).toHaveLength(2)
      expect(store.searchResults[0].id).toBe(2)
    })

    it('should accept empty array', () => {
      const store = useSearchStore()

      store.setResults([{ id: 1 }])
      store.setResults([])

      expect(store.searchResults).toEqual([])
    })
  })

  describe('reset', () => {
    it('should reset all fields to default values', () => {
      const store = useSearchStore()

      // Remplir le store
      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké',
        date: '2024-01-15',
        passengers: 3,
        ref: '81'
      })
      store.setResults([{ id: 1 }, { id: 2 }])

      // Reset
      store.reset()

      // Vérifier que tout est réinitialisé
      expect(store.type).toBeNull()
      expect(store.from).toBeNull()
      expect(store.to).toBeNull()
      expect(store.date).toBeNull()
      expect(store.passengers).toBe(1)
      expect(store.searchResults).toEqual([])
      expect(store.ref).toBeNull()
    })

    it('should be callable multiple times', () => {
      const store = useSearchStore()

      store.setSearchParams({ type: 'car', from: 'Abidjan' })
      store.reset()
      store.reset()

      expect(store.type).toBeNull()
      expect(store.from).toBeNull()
    })
  })

  describe('Getter: isValidSearch', () => {
    it('should return true for valid car search', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké'
      })

      expect(store.isValidSearch).toBe(true)
    })

    it('should return false for car search without from', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'car',
        to: 'Bouaké'
      })

      expect(store.isValidSearch).toBe(false)
    })

    it('should return false for car search without to', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'car',
        from: 'Abidjan'
      })

      expect(store.isValidSearch).toBe(false)
    })

    it('should return false for car search without from and to', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'car'
      })

      expect(store.isValidSearch).toBe(false)
    })

    it('should return true for valid bus search', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'bus',
        ref: '81'
      })

      expect(store.isValidSearch).toBe(true)
    })

    it('should return false for bus search without ref', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'bus'
      })

      expect(store.isValidSearch).toBe(false)
    })

    it('should return false for bus search with empty ref', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'bus',
        ref: ''
      })

      expect(store.isValidSearch).toBe(false)
    })

    it('should return true if from and to are defined (even without explicit car type)', () => {
      const store = useSearchStore()

      // Définir from et to mais pas de type
      store.from = 'Abidjan'
      store.to = 'Bouaké'
      // Ne pas définir store.type (null par défaut)

      // Le getter retourne true car from et to sont définis
      // C'est le comportement par défaut pour les recherches car
      expect(store.isValidSearch).toBe(true)
    })

    it('should not require date and passengers for validation', () => {
      const store = useSearchStore()

      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké'
        // Pas de date ni passengers
      })

      expect(store.isValidSearch).toBe(true)
    })
  })

  describe('Reactivity', () => {
    it('should have reactive changes', () => {
      const store = useSearchStore()

      expect(store.isValidSearch).toBe(false)

      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké'
      })

      expect(store.isValidSearch).toBe(true)

      store.setSearchParams({
        from: null
      })

      expect(store.isValidSearch).toBe(false)
    })
  })

  describe('Real usage scenarios', () => {
    it('Scenario 1: Complete car search', () => {
      const store = useSearchStore()

      // Utilisateur sélectionne le type
      store.setSearchParams({ type: 'car' })
      expect(store.isValidSearch).toBe(false)

      // Utilisateur sélectionne la ville de départ
      store.setSearchParams({ from: 'Abidjan' })
      expect(store.isValidSearch).toBe(false)

      // Utilisateur sélectionne la ville d'arrivée
      store.setSearchParams({ to: 'Yamoussoukro' })
      expect(store.isValidSearch).toBe(true)

      // Utilisateur ajoute des passagers
      store.setSearchParams({ passengers: 4 })
      expect(store.isValidSearch).toBe(true)
      expect(store.passengers).toBe(4)
    })

    it('Scenario 2: Bus search', () => {
      const store = useSearchStore()

      // Utilisateur bascule sur bus
      store.setSearchParams({ type: 'bus' })
      expect(store.isValidSearch).toBe(false)

      // Utilisateur entre le numéro de bus
      store.setSearchParams({ ref: '81' })
      expect(store.isValidSearch).toBe(true)
    })

    it('Scenario 3: Search type change', () => {
      const store = useSearchStore()

      // Recherche car
      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké'
      })
      expect(store.isValidSearch).toBe(true)

      // Changement vers bus
      store.setSearchParams({ type: 'bus' })
      expect(store.isValidSearch).toBe(false) // ref n'est pas défini

      // Ajout du ref
      store.setSearchParams({ ref: '82' })
      expect(store.isValidSearch).toBe(true)
    })

    it('Scenario 4: New search after reset', () => {
      const store = useSearchStore()

      // Première recherche
      store.setSearchParams({
        type: 'car',
        from: 'Abidjan',
        to: 'Bouaké'
      })
      store.setResults([{ id: 1 }])

      // Reset pour nouvelle recherche
      store.reset()
      expect(store.isValidSearch).toBe(false)
      expect(store.searchResults).toEqual([])

      // Nouvelle recherche
      store.setSearchParams({
        type: 'bus',
        ref: '81'
      })
      expect(store.isValidSearch).toBe(true)
    })
  })
})
