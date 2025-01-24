/**
 * Remove accents from a string
 * @param str 
 * @returns 
 */
export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 *  Normalize a city name
 * @param city 
 * @returns 
 */
export const normalizeCity = (city: string): string => {
  return removeAccents(city).trim();
}

/**
 *  Capitalize words in a string
 * @param input 
 * @returns 
 */
export const capitalizeWords = (input: string): string => {
  return input
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
