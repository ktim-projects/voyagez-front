import { describe, it, expect } from 'vitest'
import { isFirstParty } from '~/server/utils/first-party'

/**
 * Le contrôle first-party remplace la clé d'API qui était embarquée dans le
 * bundle client. C'est désormais lui qui décide si une requête sans clé est
 * servie : il mérite d'être verrouillé.
 */
describe('isFirstParty', () => {
  const host = 'geyavo.com'

  describe('Sec-Fetch-Site fait foi quand il est présent', () => {
    it('accepte une requête same-origin', () => {
      expect(isFirstParty('same-origin', undefined, host)).toBe(true)
    })

    it('accepte une requête same-site', () => {
      expect(isFirstParty('same-site', undefined, host)).toBe(true)
    })

    it('accepte une navigation directe (none)', () => {
      expect(isFirstParty('none', undefined, host)).toBe(true)
    })

    it('refuse une requête cross-site', () => {
      expect(isFirstParty('cross-site', undefined, host)).toBe(false)
    })

    it('refuse une requête cross-site même si Origin prétend le contraire', () => {
      expect(isFirstParty('cross-site', 'https://geyavo.com', host)).toBe(false)
    })
  })

  describe('repli sur Origin', () => {
    it('accepte une origine identique', () => {
      expect(isFirstParty(undefined, 'https://geyavo.com', host)).toBe(true)
    })

    it('accepte une origine identique sur un autre port explicite', () => {
      expect(isFirstParty(undefined, 'http://localhost:3000', 'localhost:3000')).toBe(true)
    })

    it('refuse une origine étrangère', () => {
      expect(isFirstParty(undefined, 'https://attaquant.example', host)).toBe(false)
    })

    it('refuse un sous-domaine qui usurpe le host', () => {
      expect(isFirstParty(undefined, 'https://geyavo.com.attaquant.example', host)).toBe(false)
    })

    it('refuse une origine illisible', () => {
      expect(isFirstParty(undefined, 'pas-une-url', host)).toBe(false)
    })
  })

  describe('appels non navigateur', () => {
    it('accepte une requête sans aucun en-tête (rendu serveur, serveur à serveur)', () => {
      expect(isFirstParty(undefined, undefined, host)).toBe(true)
    })
  })
})
