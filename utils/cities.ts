import { slugify } from './slugify'

/**
 * Map de correspondance entre les slugs et les noms de villes avec accents
 * Clé : slug (sans accent, minuscule)
 * Valeur : nom officiel de la ville (avec accents et majuscules)
 */
export const citySlugMap: Record<string, string> = {
  'abengourou': 'Abengourou',
  'abidjan': 'Abidjan',
  'aboisso': 'Aboisso',
  'accra': 'Accra',
  'adiake': 'Adiaké',
  'adzopé': 'Adzopé',
  'agboville': 'Agboville',
  'akoupe': 'Akoupé',
  'alepe': 'Alépé',
  'bamako': 'Bamako',
  'bangolo': 'Bangolo',
  'biankouma': 'Biankouma',
  'bingerville': 'Bingerville',
  'bobo': 'Bobo',
  'bocanda': 'Bocanda',
  'bondoukou': 'Bondoukou',
  'bouafle': 'Bouaflé',
  'bouake': 'Bouaké',
  'boundiali': 'Boundiali',
  'conakry': 'Conakry',
  'cotonou': 'Cotonou',
  'dabola': 'Dabola',
  'dabou': 'Dabou',
  'daloa': 'Daloa',
  'danane': 'Danané',
  'daoukro': 'Daoukro',
  'diawala': 'Diawala',
  'dimbokro': 'Dimbokro',
  'divo': 'Divo',
  'duekoue': 'Duékoué',
  'faranah': 'Faranah',
  'ferkessedougou': 'Ferkessédougou',
  'fresco': 'Fresco',
  'gabiadji': 'Gabiadji',
  'gagnoa': 'Gagnoa',
  'gbon': 'Gbon',
  'grand-bassam': 'Grand-Bassam',
  'grand-lahou': 'Grand-Lahou',
  'guiglo': 'Guiglo',
  'hire': 'Hire',
  'issia': 'Issia',
  'jacqueville': 'Jacqueville',
  'katiola': 'Katiola',
  'kindia': 'Kindia',
  'kissidougou': 'Kissidougou',
  'korhogo': 'Korhogo',
  'kouto': 'Kouto',
  'lakota': 'Lakota',
  'lola': 'Lola',
  'lome': 'Lomé',
  'macenta': 'Macenta',
  'mamou': 'Mamou',
  'man': 'Man',
  'niakara': 'Niakara',
  'nielle': 'Nielle',
  'nzerekore': 'Nzérékoré',
  'odienne': 'Odienné',
  'ouaga': 'Ouaga',
  'ouangolodougou': 'Ouangolodougou',
  'oume': 'Oumé',
  'pogo': 'Pogo',
  'san-pedro': 'San-Pédro',
  'sassandra': 'Sassandra',
  'seguela': 'Séguéla',
  'sikasso': 'Sikasso',
  'sinfra': 'Sinfra',
  'soubre': 'Soubré',
  'tabou': 'Tabou',
  'tafiri': 'Tafiré',
  'tengrela': 'Tengréla',
  'tiassale': 'Tiassalé',
  'touba': 'Touba',
  'toumodi': 'Toumodi',
  'vavoua': 'Vavoua',
  'yamoussoukro': 'Yamoussoukro',
  'zouan-hounien': 'Zouan-Hounien',
  'zuenoula': 'Zuénoula',
  'bonon': 'Bonon',
  'guessabo': 'Guessabo',
  'ouaninou': 'Ouaninou',
  'labe': 'Labé',
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
