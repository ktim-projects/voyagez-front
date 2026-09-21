import { describe, it, expect } from 'vitest'
import {
  getCompanySlug,
  getCompanyInitials,
  parseCompanyPhones,
  toPhoneHref,
  resolveCompanyFilter
} from '~/utils/companies'

describe('companies utils', () => {
  describe('getCompanySlug', () => {
    it('derives the slug from the company name', () => {
      expect(getCompanySlug({ name: 'UTB' })).toBe('utb')
      expect(getCompanySlug({ name: 'Grand Sud' })).toBe('grand-sud')
      expect(getCompanySlug({ name: 'SBTA' })).toBe('sbta')
    })

    it('strips accents and special characters', () => {
      expect(getCompanySlug({ name: 'Compagnie Élite' })).toBe('compagnie-elite')
      expect(getCompanySlug({ name: "Transport d'Abidjan" })).toBe('transport-d-abidjan')
      expect(getCompanySlug({ name: 'UTB  —  Express' })).toBe('utb-express')
    })

    // La colonne slug permet de figer une URL déjà partagée même si la
    // compagnie change de nom : elle doit primer sur le nom.
    it('prefers the explicit slug column when set', () => {
      expect(getCompanySlug({ name: 'UTB', slug: 'utb-officiel' })).toBe('utb-officiel')
    })

    it('falls back to the name when the slug column is empty', () => {
      expect(getCompanySlug({ name: 'UTB', slug: '' })).toBe('utb')
      expect(getCompanySlug({ name: 'UTB', slug: '   ' })).toBe('utb')
      expect(getCompanySlug({ name: 'UTB', slug: null })).toBe('utb')
    })

    it('normalises an explicit slug that was entered by hand', () => {
      expect(getCompanySlug({ name: 'UTB', slug: 'UTB Officiel' })).toBe('utb-officiel')
    })

    it('returns an empty slug for a nameless company', () => {
      expect(getCompanySlug({ name: '' })).toBe('')
      expect(getCompanySlug({})).toBe('')
    })

    // Le slug est l'URL publique : deux compagnies distinctes ne doivent pas
    // se retrouver sur la même page.
    it('keeps distinct names on distinct slugs', () => {
      const names = ['UTB', 'SBTA', 'ART', 'SIDO', 'RAHIMO', 'SHT', 'TSR']
      const slugs = names.map(name => getCompanySlug({ name }))

      expect(new Set(slugs).size).toBe(names.length)
    })
  })

  describe('getCompanyInitials', () => {
    it('takes the first letter of the first two words', () => {
      expect(getCompanyInitials('Grand Sud Transport')).toBe('GS')
      expect(getCompanyInitials('Baobab Voyages')).toBe('BV')
    })

    it('keeps a short acronym whole', () => {
      expect(getCompanyInitials('UTB')).toBe('UTB')
      expect(getCompanyInitials('ci')).toBe('CI')
    })

    it('truncates a long single word', () => {
      expect(getCompanyInitials('Rahimo')).toBe('RA')
    })

    it('handles missing or blank names', () => {
      expect(getCompanyInitials('')).toBe('?')
      expect(getCompanyInitials('   ')).toBe('?')
      expect(getCompanyInitials(null)).toBe('?')
      expect(getCompanyInitials(undefined)).toBe('?')
    })
  })

  describe('parseCompanyPhones', () => {
    it('splits multiple numbers', () => {
      expect(parseCompanyPhones('07 00 00 00 00, 05 11 11 11 11'))
        .toEqual(['07 00 00 00 00', '05 11 11 11 11'])
      expect(parseCompanyPhones('0700000000;0511111111'))
        .toEqual(['0700000000', '0511111111'])
    })

    it('returns a single number unchanged', () => {
      expect(parseCompanyPhones('07 00 00 00 00')).toEqual(['07 00 00 00 00'])
    })

    it('returns an empty list when there is no contact', () => {
      expect(parseCompanyPhones('')).toEqual([])
      expect(parseCompanyPhones(null)).toEqual([])
      expect(parseCompanyPhones(undefined)).toEqual([])
    })

    it('drops empty segments left by trailing separators', () => {
      expect(parseCompanyPhones('0700000000, , ')).toEqual(['0700000000'])
    })
  })

  describe('toPhoneHref', () => {
    it('strips separators and adds the Ivorian dialling code', () => {
      expect(toPhoneHref('07 00 00 00 00')).toBe('+2250700000000')
      expect(toPhoneHref('07-00-00-00-00')).toBe('+2250700000000')
      expect(toPhoneHref('07.00.00.00.00')).toBe('+2250700000000')
    })

    it('keeps an already international number', () => {
      expect(toPhoneHref('+225 07 00 00 00 00')).toBe('+2250700000000')
    })
  })

  describe('resolveCompanyFilter', () => {
    const companies = [
      { id: '946a323f', name: 'UTB' },
      { id: '7ea6e5de', name: 'SBTA' },
      { id: 'abc123', name: 'Grand Sud' }
    ]

    it('resolves a slug to the matching company id', () => {
      expect(resolveCompanyFilter('utb', companies)).toEqual(['946a323f'])
      expect(resolveCompanyFilter('grand-sud', companies)).toEqual(['abc123'])
    })

    it('honours an explicit slug column', () => {
      const withSlug = [{ id: 'x1', name: 'UTB', slug: 'utb-officiel' }]

      expect(resolveCompanyFilter('utb-officiel', withSlug)).toEqual(['x1'])
      expect(resolveCompanyFilter('utb', withSlug)).toEqual([])
    })

    // Un slug inconnu doit laisser la recherche non filtrée : la filtrer sur
    // une compagnie inexistante donnerait une page de résultats vide.
    it('returns nothing for an unknown slug', () => {
      expect(resolveCompanyFilter('compagnie-inconnue', companies)).toEqual([])
    })

    it('returns nothing when the parameter is absent or blank', () => {
      expect(resolveCompanyFilter(undefined, companies)).toEqual([])
      expect(resolveCompanyFilter(null, companies)).toEqual([])
      expect(resolveCompanyFilter('', companies)).toEqual([])
      expect(resolveCompanyFilter('   ', companies)).toEqual([])
    })

    it('tolerates a slug typed with different casing or spacing', () => {
      expect(resolveCompanyFilter(' UTB ', companies)).toEqual(['946a323f'])
      expect(resolveCompanyFilter('Grand Sud', companies)).toEqual(['abc123'])
    })
  })
})
