import { slugify } from './slugify'

/**
 * Slug d'URL d'une compagnie, dérivé de son nom.
 *
 * La colonne `company.slug` reste prioritaire quand elle est renseignée :
 * elle permet de figer une URL déjà partagée même si la compagnie change de
 * nom. Sans elle, le nom fait foi.
 *
 * @example
 * getCompanySlug({ name: 'UTB' })                          // 'utb'
 * getCompanySlug({ name: 'Grand Sud' })                    // 'grand-sud'
 * getCompanySlug({ name: 'UTB', slug: 'utb-officiel' })    // 'utb-officiel'
 */
export const getCompanySlug = (company: { name?: string | null; slug?: string | null }): string => {
  const explicit = company.slug?.trim()

  if (explicit) {
    return slugify(explicit)
  }

  return slugify(company.name ?? '')
}

/**
 * Initiales d'une compagnie, utilisées quand aucun logo n'est disponible.
 *
 * Un sigle court est affiché en entier : « UTB » se lit mieux que « UT ».
 *
 * @example
 * getCompanyInitials('Grand Sud Transport') // 'GS'
 * getCompanyInitials('UTB')                 // 'UTB'
 */
export const getCompanyInitials = (name?: string | null): string => {
  if (!name) return '?'

  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return '?'

  if (words.length === 1) {
    const word = words[0]!
    return (word.length <= 3 ? word : word.slice(0, 2)).toUpperCase()
  }

  return words
    .slice(0, 2)
    .map(word => word[0] ?? '')
    .join('')
    .toUpperCase()
}

/**
 * Numéros de téléphone d'une compagnie.
 *
 * Le champ `contact` peut contenir plusieurs numéros séparés par des virgules
 * ou des points-virgules, comme `departure.contacts`.
 */
export const parseCompanyPhones = (contact?: string | null): string[] => {
  if (!contact) return []

  return contact
    .split(/[,;]/)
    .map(phone => phone.trim())
    .filter(Boolean)
}

/**
 * Numéro utilisable dans un lien `tel:` : espaces et séparateurs retirés.
 * L'indicatif ivoirien est ajouté quand le numéro est donné en national.
 */
export const toPhoneHref = (phone: string): string => {
  const cleaned = phone.replace(/[\s.-]/g, '')

  return cleaned.startsWith('+') ? cleaned : `+225${cleaned}`
}

/**
 * Identifiants de compagnie correspondant à un slug d'URL.
 *
 * Les pages compagnie renvoient vers un trajet avec `?compagnie=<slug>` ;
 * l'API de recherche, elle, filtre sur l'identifiant de l'opérateur. Renvoie
 * un tableau vide quand le slug ne correspond à rien, pour que la recherche
 * reste non filtrée plutôt que vide.
 */
export const resolveCompanyFilter = (
  slug: string | undefined | null,
  companies: ReadonlyArray<{ id: string; name: string; slug?: string | null }>
): string[] => {
  const wanted = slug?.trim()

  if (!wanted) return []

  const match = companies.find(company => getCompanySlug(company) === slugify(wanted))

  return match ? [match.id] : []
}

/**
 * Prix affiché sur la page compagnie : `5 000 F`.
 *
 * `toLocaleString('fr-FR')` sépare les milliers par une espace fine
 * insécable, qui ne se voit pas dans toutes les polices : elle est remplacée
 * par une espace ordinaire.
 */
export const formatCompanyPrice = (price?: number | null): string | null => {
  if (typeof price !== 'number' || !Number.isFinite(price)) return null

  return `${price.toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ')} F`
}

/**
 * Fourchette de prix compacte affichée dans le bandeau : `3,5k – 12k`.
 * Renvoie null quand aucun prix n'est connu, plutôt qu'une fourchette vide.
 */
export const formatPriceRange = (
  minPrice?: number | null,
  maxPrice?: number | null
): string | null => {
  const toCompact = (price: number): string =>
    `${(price / 1000).toString().replace('.', ',')}k`

  const hasMin = typeof minPrice === 'number' && Number.isFinite(minPrice)
  const hasMax = typeof maxPrice === 'number' && Number.isFinite(maxPrice)

  if (!hasMin || !hasMax) return null
  if (minPrice === maxPrice) return toCompact(minPrice!)

  return `${toCompact(minPrice!)} – ${toCompact(maxPrice!)}`
}

/**
 * Moment de la journée d'un départ, pour le filtre de la page compagnie.
 */
export const getDepartureMoment = (time: string): 'Matin' | 'Après-midi' | 'Soir' => {
  const hours = Number.parseInt(time.slice(0, 2), 10)

  if (!Number.isFinite(hours) || hours < 12) return 'Matin'

  return hours < 18 ? 'Après-midi' : 'Soir'
}
