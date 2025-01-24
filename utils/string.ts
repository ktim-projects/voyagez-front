export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeCity(city: string): string {
  return removeAccents(city).trim();
}
