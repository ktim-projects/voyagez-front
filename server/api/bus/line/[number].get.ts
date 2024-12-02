import { busLines } from '../../../data';

export default defineEventHandler((event) => {
  const number = getRouterParam(event, 'number');
  const line = busLines.find(line => line.number === number);
  
  if (!line) {
    throw createError({
      statusCode: 404,
      message: `La ligne de bus ${number} n'a pas été trouvée`
    });
  }

  return line;
});