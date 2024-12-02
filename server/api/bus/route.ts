import { busRoutes } from '../../data';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { from, to } = query;

  if (!from || !to) {
    throw createError({
      statusCode: 400,
      message: 'Les paramètres de départ et d\'arrivée sont requis'
    });
  }

  try {
    // Find matching route
    const matchingRoute = busRoutes.find(route => {
      const matchesFrom = route.from.toLowerCase().includes((from as string).toLowerCase());
      const matchesTo = route.to.toLowerCase().includes((to as string).toLowerCase());
      return matchesFrom && matchesTo;
    });

    if (!matchingRoute) {
      throw createError({
        statusCode: 404,
        message: 'Aucun itinéraire trouvé pour ce trajet'
      });
    }

    return matchingRoute;
  } catch (error) {
    console.error('Error finding route:', error);
    throw createError({
      statusCode: 500,
      message: 'Une erreur est survenue lors de la recherche d\'itinéraire'
    });
  }
});