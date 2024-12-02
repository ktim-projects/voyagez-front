export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { input } = query;

  if (!input) {
    return [];
  }

  // Use OpenStreetMap's Nominatim API for geocoding
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${input}&format=json&countrycodes=ci&limit=5`
  );
  const data = await response.json();

  return data.map((place: any) => ({
    display_name: place.display_name,
    lat: place.lat,
    lon: place.lon
  }));
});