
export const formatTime = (time: string): string => {
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
};

export const formatDuration = (minutes: number): string => {
    if (minutes < 0) {
      throw new Error("La durée ne peut pas être négative.");
    }
  
    const hours = Math.floor(minutes / 60); // Calcul des heures
    const remainingMinutes = minutes % 60; // Calcul des minutes restantes
  
    const hoursPart = hours > 0 ? `${hours}h` : ""; // Format des heures
    const minutesPart = remainingMinutes > 0 ? `${remainingMinutes}min` : ""; // Format des minutes
  
    // Combine les parties avec un espace si les deux existent
    return [hoursPart, minutesPart].filter(Boolean).join(" ");
  }

/**
 * Plafond du filtre "prix maximum" (en FCFA).
 * Quand le curseur est à cette valeur, le filtre est considéré comme inactif
 * et n'est pas envoyé à l'API : sans cela, tout départ au-dessus du plafond
 * serait silencieusement masqué.
 */
export const MAX_PRICE_FILTER = 50000;
