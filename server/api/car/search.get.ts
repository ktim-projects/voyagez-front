import { carJourneys } from '../../data';

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { from, to, date } = query;

  if (!from || !to) {
    throw createError({
      statusCode: 400,
      message: 'Les paramètres de départ et d\'arrivée sont requis'
    });
  }

  const filteredJourneys = carJourneys.filter(journey => {
    const matchesOrigin = journey.origin.toLowerCase() === (from as string).toLowerCase();
    const matchesDestination = journey.destination.toLowerCase() === (to as string).toLowerCase();
    const matchesDate = !date || journey.date === date;

    return matchesOrigin && matchesDestination && matchesDate;
  });

  return filteredJourneys;
});