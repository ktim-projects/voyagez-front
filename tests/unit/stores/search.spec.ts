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

      expect(store.from).toBeNull()
      expect(store.to).toBeNull()
      expect(store.date).toBeNull()
      expect(store.passengers).toBe(1)
    })
  })

  describe('setSearchParams', () => {
    it('should update search parameters', () => {
      const store = useSearchStore()

      store.setSearchParams({
        from: 'Abidjan',
        to: 'Bouaké',
        date: '2024-01-15',
        passengers: 2
      })

      expect(store.from).toBe('Abidjan')
      expect(store.to).toBe('Bouaké')
      expect(store.date).toBe('2024-01-15')
      expect(store.passengers).toBe(2)
    })

    it('should partially update parameters', () => {
      const store = useSearchStore()

      // Initialiser avec des valeurs
      store.setSearchParams({
        from: 'Abidjan',
        to: 'Bouaké'
      })

      // Mettre à jour seulement certains champs
      store.setSearchParams({
        passengers: 3
      })

      expect(store.from).toBe('Abidjan')
      expect(store.to).toBe('Bouaké')
      expect(store.passengers).toBe(3)
    })

    it('should accept null as value', () => {
      const store = useSearchStore()

      store.setSearchParams({
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

  describe('reset', () => {
    it('should reset all fields to default values', () => {
      const store = useSearchStore()

      // Remplir le store
      store.setSearchParams({
        from: 'Abidjan',
        to: 'Bouaké',
        date: '2024-01-15',
        passengers: 3
      })

      // Reset
      store.reset()

      // Vérifier que tout est réinitialisé
      expect(store.from).toBeNull()
      expect(store.to).toBeNull()
      expect(store.date).toBeNull()
      expect(store.passengers).toBe(1)
    })

    it('should be callable multiple times', () => {
      const store = useSearchStore()

      store.setSearchParams({ from: 'Abidjan' })
      store.reset()
      store.reset()

      expect(store.from).toBeNull()
    })
  })

  describe('Getter: isValidSearch', () => {
    it('should return true for a valid search', () => {
      const store = useSearchStore()

      store.setSearchParams({
        from: 'Abidjan',
        to: 'Bouaké'
      })

      expect(store.isValidSearch).toBe(true)
    })

    it('should return false for a search without from', () => {
      const store = useSearchStore()

      store.setSearchParams({
        to: 'Bouaké'
      })

      expect(store.isValidSearch).toBe(false)
    })

    it('should return false for a search without to', () => {
      const store = useSearchStore()

      store.setSearchParams({
        from: 'Abidjan'
      })

      expect(store.isValidSearch).toBe(false)
    })

    it('should return false for a search without from and to', () => {
      const store = useSearchStore()

      expect(store.isValidSearch).toBe(false)
    })

    it('should return false when from or to is an empty string', () => {
      const store = useSearchStore()

      store.setSearchParams({
        from: '',
        to: 'Bouaké'
      })

      expect(store.isValidSearch).toBe(false)
    })

    it('should not require date and passengers for validation', () => {
      const store = useSearchStore()

      store.setSearchParams({
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
    it('Scenario 1: Complete search', () => {
      const store = useSearchStore()

      // Utilisateur choisit sa ville de départ
      store.setSearchParams({ from: 'Abidjan' })
      expect(store.isValidSearch).toBe(false)

      // Puis sa destination
      store.setSearchParams({ to: 'Bouaké' })
      expect(store.isValidSearch).toBe(true)

      // Puis le nombre de passagers
      store.setSearchParams({ passengers: 2 })

      expect(store.from).toBe('Abidjan')
      expect(store.to).toBe('Bouaké')
      expect(store.passengers).toBe(2)
    })

    it('Scenario 2: Trajet inversé', () => {
      const store = useSearchStore()

      store.setSearchParams({ from: 'Abidjan', to: 'Bouaké' })

      store.setSearchParams({ from: store.to, to: store.from })

      expect(store.from).toBe('Bouaké')
      expect(store.to).toBe('Abidjan')
      expect(store.isValidSearch).toBe(true)
    })

    it('Scenario 3: New search after reset', () => {
      const store = useSearchStore()

      store.setSearchParams({ from: 'Abidjan', to: 'Bouaké' })
      store.reset()

      expect(store.isValidSearch).toBe(false)

      store.setSearchParams({ from: 'Yamoussoukro', to: 'Korhogo' })

      expect(store.from).toBe('Yamoussoukro')
      expect(store.to).toBe('Korhogo')
      expect(store.isValidSearch).toBe(true)
    })
  })
})
