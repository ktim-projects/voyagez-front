export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { input } = query;

  if (!input) {
    return [];
  }

  try {
    // Use OpenStreetMap's Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input as string)}&format=json&countrycodes=ci&limit=5`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch places');
    }

    const data = await response.json();

    return data.map((place: any) => ({
      display_name: place.display_name,
      lat: place.lat,
      lon: place.lon
    }));
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
});