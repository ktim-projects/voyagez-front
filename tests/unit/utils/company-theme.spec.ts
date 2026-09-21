import { describe, it, expect } from 'vitest'
import {
  alpha,
  buildCompanyTheme,
  DEFAULT_BRAND_COLOR,
  hexToRgb,
  luminance,
  mix,
  normalizeBrandColor,
  rgbToHex,
  toThemeVariables
} from '~/utils/company-theme'

/**
 * La couleur de marque est saisie à la main en base. La palette doit rester
 * lisible pour n'importe quelle teinte : c'est ce que verrouillent ces tests.
 */

describe('company theme', () => {
  describe('conversions', () => {
    it('lit une couleur sur trois ou six caractères', () => {
      expect(hexToRgb('#0A2540')).toEqual([10, 37, 64])
      expect(hexToRgb('#fff')).toEqual([255, 255, 255])
    })

    it('retourne en hexadécimal en bornant les composantes', () => {
      expect(rgbToHex([10, 37, 64])).toBe('#0a2540')
      expect(rgbToHex([-20, 300, 64])).toBe('#00ff40')
    })

    it('mélange deux couleurs', () => {
      expect(mix('#000000', '#ffffff', 0)).toBe('#000000')
      expect(mix('#000000', '#ffffff', 1)).toBe('#ffffff')
      expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080')
    })

    it('classe les couleurs par luminance', () => {
      expect(luminance('#ffffff')).toBeCloseTo(1, 5)
      expect(luminance('#000000')).toBeCloseTo(0, 5)
      expect(luminance('#E9D66B')).toBeGreaterThan(luminance('#0A2540'))
    })

    it('exprime une couleur en rgba', () => {
      expect(alpha('#0A2540', 0.28)).toBe('rgba(10,37,64,0.28)')
    })
  })

  describe('normalizeBrandColor', () => {
    it('accepte un hexadécimal complet', () => {
      expect(normalizeBrandColor('#1B7F4B')).toBe('#1B7F4B')
      expect(normalizeBrandColor('  #1b7f4b  ')).toBe('#1b7f4b')
    })

    // La page peut être servie avant que la migration n'ajoute la contrainte.
    it('retombe sur la charte pour une valeur inexploitable', () => {
      expect(normalizeBrandColor(null)).toBe(DEFAULT_BRAND_COLOR)
      expect(normalizeBrandColor(undefined)).toBe(DEFAULT_BRAND_COLOR)
      expect(normalizeBrandColor('')).toBe(DEFAULT_BRAND_COLOR)
      expect(normalizeBrandColor('vert')).toBe(DEFAULT_BRAND_COLOR)
      expect(normalizeBrandColor('#fff')).toBe(DEFAULT_BRAND_COLOR)
      expect(normalizeBrandColor('#12345g')).toBe(DEFAULT_BRAND_COLOR)
    })
  })

  describe('buildCompanyTheme', () => {
    it('pose un texte blanc sur une marque sombre', () => {
      const theme = buildCompanyTheme('#1B7F4B')

      expect(theme.onBrand).toBe('#ffffff')
      expect(theme.onBrandSoft).toBe('rgba(255,255,255,.78)')
    })

    it('pose un texte foncé sur une marque claire', () => {
      const theme = buildCompanyTheme('#E9D66B')

      expect(theme.onBrand).toBe('#0A2540')
      expect(theme.onBrandSoft).toBe('rgba(10,37,64,.72)')
    })

    // Sur fond blanc, une marque claire doit être assombrie avant de servir
    // d'encre : un jaune pur y serait illisible.
    it('assombrit une marque claire avant de l\'utiliser comme encre', () => {
      const light = buildCompanyTheme('#E9D66B')
      const dark = buildCompanyTheme('#1B7F4B')

      expect(light.brandInk).not.toBe(light.brand)
      expect(luminance(light.brandInk)).toBeLessThan(luminance(light.brand))
      expect(dark.brandInk).toBe(dark.brand)
    })

    it('garde une encre lisible sur les pastilles quelle que soit la marque', () => {
      for (const brand of ['#1B7F4B', '#0A2540', '#E9D66B', '#101010', '#ffffff']) {
        const theme = buildCompanyTheme(brand)

        expect(luminance(theme.chipInk)).toBeLessThan(luminance(theme.chipBg))
      }
    })

    // Sans photo, une tuile de ville n'a que son aplat pour se distinguer du
    // fond : il doit être plus marqué que celui des pastilles.
    it('teinte les tuiles plus franchement que les pastilles', () => {
      for (const brand of ['#1B7F4B', '#E9D66B', '#0A2540']) {
        const theme = buildCompanyTheme(brand)

        expect(luminance(theme.tileBg)).toBeLessThan(luminance(theme.chipBg))
      }
    })

    it('utilise la charte quand la compagnie n\'a pas de couleur', () => {
      expect(buildCompanyTheme(null).brand).toBe(DEFAULT_BRAND_COLOR)
      expect(buildCompanyTheme(null).onBrand).toBe('#ffffff')
    })
  })

  describe('toThemeVariables', () => {
    it('expose la palette en variables CSS préfixées', () => {
      const variables = toThemeVariables(buildCompanyTheme('#1B7F4B'))

      expect(variables['--gy-brand']).toBe('#1B7F4B')
      expect(variables['--gy-on-brand']).toBe('#ffffff')
      expect(variables['--gy-page-bg']).toBe('#f7f9fb')
    })

    it('nomme une variable pour chaque couleur de la palette', () => {
      const theme = buildCompanyTheme('#1B7F4B')
      const variables = toThemeVariables(theme)

      expect(Object.keys(variables)).toHaveLength(Object.keys(theme).length)
      expect(Object.keys(variables).every(key => key.startsWith('--gy-'))).toBe(true)
    })
  })
})
