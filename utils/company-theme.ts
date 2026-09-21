/**
 * Palette d'une page compagnie, dérivée de sa couleur de marque.
 *
 * La page est faite pour être partagée par la compagnie elle-même : elle prend
 * ses couleurs. Tout est recalculé à partir de `company.brand_color` pour que
 * le texte reste lisible quelle que soit la teinte saisie — une marque jaune
 * doit donner un texte foncé, une marque bleu nuit un texte blanc.
 *
 * Les valeurs sortent en CSS brut (et non en classes Tailwind) parce qu'elles
 * dépendent d'une donnée de la base : aucune classe construite ici ne
 * survivrait à la purge.
 *
 * Seul le thème clair est implémenté : la page ne suit pas le mode sombre du
 * site, qui n'a par ailleurs aucun interrupteur.
 */

/** Bleu nuit de la charte (primary-600), encre par défaut. */
const INK = '#0A2540'
const WHITE = '#ffffff'

/** Couleur retenue quand la compagnie n'a pas renseigné la sienne. */
export const DEFAULT_BRAND_COLOR = INK

/** Corail de la charte (corail-500) : l'appel à l'action reste celui de Geyavo. */
export const CTA_COLOR = '#FF6B4A'
export const CTA_COLOR_HOVER = '#f2573a'

const clampChannel = (value: number): number => Math.max(0, Math.min(255, Math.round(value)))

/** Composantes RVB d'une couleur `#rgb` ou `#rrggbb`. */
export const hexToRgb = (hex: string): [number, number, number] => {
  const raw = hex.replace('#', '')
  const full = raw.length === 3 ? raw.split('').map(char => char + char).join('') : raw

  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16)
  ]
}

export const rgbToHex = (rgb: number[]): string =>
  `#${rgb.map(value => clampChannel(value).toString(16).padStart(2, '0')).join('')}`

/** Mélange linéaire de deux couleurs, `ratio` = part de `to`. */
export const mix = (from: string, to: string, ratio: number): string => {
  const a = hexToRgb(from)
  const b = hexToRgb(to)

  return rgbToHex(a.map((value, index) => value + ((b[index] ?? value) - value) * ratio))
}

/** Luminance relative WCAG, qui décide de la couleur du texte posé dessus. */
export const luminance = (hex: string): number => {
  const [r = 0, g = 0, b = 0] = hexToRgb(hex).map((value) => {
    const channel = value / 255

    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const alpha = (hex: string, opacity: number): string => {
  const [r, g, b] = hexToRgb(hex)

  return `rgba(${r},${g},${b},${opacity})`
}

/**
 * Une couleur de marque exploitable est un `#rrggbb`. La contrainte SQL
 * garantit déjà ce format, mais la page peut être servie avant que la
 * migration ne soit appliquée, ou la donnée avoir été saisie à la main.
 */
export const isBrandColor = (color?: string | null): boolean => {
  const value = color?.trim()

  return Boolean(value && /^#[0-9A-Fa-f]{6}$/.test(value))
}

/** Couleur de marque exploitable, ou la charte Geyavo à défaut. */
export const normalizeBrandColor = (color?: string | null): string =>
  isBrandColor(color) ? color!.trim() : DEFAULT_BRAND_COLOR

export interface CompanyTheme {
  brand: string
  /** Marque assombrie si besoin, pour rester lisible sur fond blanc. */
  brandInk: string
  brandSoft: string
  heroBg: string
  heroWash: string
  onBrand: string
  onBrandSoft: string
  onBrandFaint: string
  onBrandLine: string
  onBrandChip: string
  logoBg: string
  chipBg: string
  chipInk: string
  tileBg: string
  pageBg: string
  surface: string
  line: string
  ink: string
  muted: string
  stickyBg: string
  noticeBg: string
  noticeLine: string
  noticeInk: string
  noticeSoft: string
}

/**
 * Palette complète d'une compagnie.
 *
 * @example
 * buildCompanyTheme('#1B7F4B').onBrand // '#ffffff' — marque sombre
 * buildCompanyTheme('#E9D66B').onBrand // '#0A2540' — marque claire
 */
export const buildCompanyTheme = (brandColor?: string | null): CompanyTheme => {
  const brand = normalizeBrandColor(brandColor)
  const level = luminance(brand)

  // Au-delà de ce seuil, la marque est trop claire pour porter du texte blanc.
  const onBrand = level > 0.45 ? INK : WHITE
  const brandInk = level > 0.42 ? mix(brand, INK, 0.55) : brand

  return {
    brand,
    brandInk,
    brandSoft: mix(brand, WHITE, 0.9),
    heroBg: brand,
    heroWash: `linear-gradient(140deg, ${alpha(onBrand, 0.1)} 0%, transparent 55%)`,
    onBrand,
    onBrandSoft: onBrand === WHITE ? 'rgba(255,255,255,.78)' : 'rgba(10,37,64,.72)',
    onBrandFaint: alpha(onBrand, onBrand === WHITE ? 0.12 : 0.1),
    onBrandLine: alpha(onBrand, 0.28),
    onBrandChip: onBrand,
    logoBg: alpha(onBrand, onBrand === WHITE ? 0.16 : 0.12),
    chipBg: mix(brand, WHITE, 0.92),
    // Les tuiles de villes sans photo n'ont que cet aplat pour exister :
    // il est plus teinté que les pastilles, qui portent déjà du texte.
    tileBg: mix(brand, WHITE, 0.86),
    chipInk: mix(brand, INK, level > 0.42 ? 0.6 : 0.25),
    pageBg: '#f7f9fb',
    surface: WHITE,
    line: '#e5e7eb',
    ink: INK,
    muted: '#6b7280',
    stickyBg: 'rgba(255,255,255,.92)',
    noticeBg: '#fff5f5',
    noticeLine: '#ffe1d9',
    noticeInk: '#b8371c',
    noticeSoft: '#7c5049'
  }
}

/**
 * Palette exposée en variables CSS, à poser sur la racine de la page. Les
 * composants s'y réfèrent via `bg-[var(--gy-surface)]` : la classe est alors
 * une chaîne fixe que Tailwind voit, et seule la valeur change.
 */
export const toThemeVariables = (theme: CompanyTheme): Record<string, string> =>
  Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [
      `--gy-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`,
      value
    ])
  )
