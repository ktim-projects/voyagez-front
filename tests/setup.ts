import { vi } from 'vitest'

// Mock de $fetch global pour Nuxt
;(global as any).$fetch = vi.fn()

// Mock de useRuntimeConfig pour Nuxt
;(global as any).useRuntimeConfig = vi.fn(() => ({
  public: {
    apiKeyFrontend: 'test-api-key-frontend'
  }
}))

// Mock de useRouter et useRoute pour Vue Router
;(global as any).useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn()
}))

;(global as any).useRoute = vi.fn(() => ({
  params: {},
  query: {},
  path: '/',
  name: 'index'
}))
