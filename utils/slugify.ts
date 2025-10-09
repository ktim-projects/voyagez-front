/**
 * Convertit un texte en slug (sans accents, minuscules, tirets)
 * @param text - Texte à slugifier
 * @returns Slug généré
 * 
 * @example
 * slugify('Bouaké') // 'bouake'
 * slugify('San-Pédro') // 'san-pedro'
 * slugify('Grand-Bassam') // 'grand-bassam'
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères spéciaux par -
    .replace(/^-+|-+$/g, ''); // Supprime les - au début/fin
}

/**
 * Convertit la première lettre de chaque mot en majuscule
 * @param text - Texte à capitaliser
 * @returns Texte capitalisé
 * 
 * @example
 * capitalize('bouake') // 'Bouake'
 * capitalize('san-pedro') // 'San-Pedro'
 */
export const capitalize = (text: string): string => {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
}
