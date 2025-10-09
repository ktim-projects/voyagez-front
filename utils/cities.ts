import { slugify } from './slugify'

/**
 * Map de correspondance entre les slugs et les noms de villes avec accents
 * Clé : slug (sans accent, minuscule)
 * Valeur : nom officiel de la ville (avec accents et majuscules)
 */
export const citySlugMap: Record<string, string> = {
  'abidjan': 'Abidjan',
  'yamoussoukro': 'Yamoussoukro',
  'bouake': 'Bouaké',
  'san-pedro': 'San-Pédro',
  'korhogo': 'Korhogo',
  'daloa': 'Daloa',
  'man': 'Man',
  'gagnoa': 'Gagnoa',
  'divo': 'Divo',
  'abengourou': 'Abengourou',
  'agboville': 'Agboville',
  'anyama': 'Anyama',
  'bingerville': 'Bingerville',
  'bondoukou': 'Bondoukou',
  'dabou': 'Dabou',
  'dimbokro': 'Dimbokro',
  'ferkessedougou': 'Ferkessédougou',
  'grand-bassam': 'Grand-Bassam',
  'grand-lahou': 'Grand-Lahou',
  'guiglo': 'Guiglo',
  'issia': 'Issia',
  'katiola': 'Katiola',
  'lakota': 'Lakota',
  'odienne': 'Odienné',
  'oume': 'Oumé',
  'sakassou': 'Sakassou',
  'sassandra': 'Sassandra',
  'seguela': 'Séguéla',
  'sinfra': 'Sinfra',
  'soubre': 'Soubré',
  'tabou': 'Tabou',
  'tanda': 'Tanda',
  'tiassale': 'Tiassalé',
  'touba': 'Touba',
  'toumodi': 'Toumodi',
  'vavoua': 'Vavoua',
  'zuenoula': 'Zuénoula',
}

/**
 * Récupère le nom officiel d'une ville à partir de son slug
 * @param slug - Slug de la ville (sans accent, minuscule)
 * @returns Nom officiel de la ville ou null si non trouvée
 * 
 * @example
 * getCityFromSlug('bouake') // 'Bouaké'
 * getCityFromSlug('san-pedro') // 'San-Pédro'
 * getCityFromSlug('invalid') // null
 */
export const getCityFromSlug = (slug: string): string | null => {
  return citySlugMap[slug.toLowerCase()] || null
}

/**
 * Génère le slug d'une ville à partir de son nom
 * @param city - Nom de la ville (avec ou sans accents)
 * @returns Slug de la ville
 * 
 * @example
 * getSlugFromCity('Bouaké') // 'bouake'
 * getSlugFromCity('San-Pédro') // 'san-pedro'
 */
export const getSlugFromCity = (city: string): string => {
  return slugify(city)
}

/**
 * Vérifie si une ville existe dans la base de données
 * @param city - Nom de la ville ou slug
 * @returns true si la ville existe
 * 
 * @example
 * isCityValid('Bouaké') // true
 * isCityValid('bouake') // true
 * isCityValid('VilleInconnue') // false
 */
export const isCityValid = (city: string): boolean => {
  const slug = slugify(city)
  return slug in citySlugMap
}

/**
 * Récupère la liste de toutes les villes disponibles
 * @returns Tableau des noms de villes (avec accents et majuscules)
 */
export const getAllCities = (): string[] => {
  return Object.values(citySlugMap)
}

/**
 * Récupère la liste de tous les slugs disponibles
 * @returns Tableau des slugs de villes
 */
export const getAllCitySlugs = (): string[] => {
  return Object.keys(citySlugMap)
}
