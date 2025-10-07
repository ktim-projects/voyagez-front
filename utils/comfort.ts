/**
 * Utilitaire pour la gestion des catégories de confort
 */

/**
 * Génère les classes CSS pour les chips de catégorie de confort
 * Utilise un hash de la catégorie pour assigner une couleur cohérente
 */
export const getComfortChipClasses = (category: string): string => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Palette de couleurs douces et subtiles
  const colorPalette = [
    'bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300',
    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300',
    'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-300',
    'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-300',
    'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-300',
    'bg-corail-50 text-corail-600 dark:bg-corail-900/20 dark:text-corail-300',
    'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300',
    'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-300',
    'bg-lime-50 text-lime-600 dark:bg-lime-900/20 dark:text-lime-300',
  ];
  
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

/**
 * Parse les détails de confort en liste de points
 * Sépare par virgules et nettoie les espaces
 */
export const parseComfortDetails = (details: string): string[] => {
  return details
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
};
