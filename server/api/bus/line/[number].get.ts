import TransportLine from '~/server/model/line-data';
import { busLines } from '../../../data';

export default defineCachedEventHandler(async(event) => {
  const number = getRouterParam(event, 'number');
  const line = {}
  const lineId = busLines.find(line => line.code.toString() === number)?.line_id

  if (!lineId) {
    throw createError({
      statusCode: 500,
      message: 'Serveur de bus introuvable'
    });
  }

  const lineData = new TransportLine();

  // fetch line data from external API ( overpass )
  // const response = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];relation(${lineId});(._;>>;);out;`);
  const status = await lineData.initFromOverpass(lineId);
  // const data = await response.json();
  console.log('lineData', lineData.getTrips());
  

  // if (!line) {
  //   throw createError({
  //     statusCode: 404,
  //     message: `La ligne de bus ${number} n'a pas été trouvée`
  //   });
  // }

  return line;
});