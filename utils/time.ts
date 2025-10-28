/**
 * Calculate the number of days difference between departure and arrival time
 * based on the duration of the trip
 * 
 * @param departureTime - Departure time in "HH:mm" format
 * @param arrivalTime - Arrival time in "HH:mm" format
 * @param duration - Trip duration in minutes
 * @returns The number of days difference (0 = same day, 1 = next day, 2 = day after next, etc.)
 * 
 * @example
 * getDaysDifference('22:00', '02:00', 240) // 1 (4h of trip = next day)
 * getDaysDifference('08:00', '12:00', 240) // 0 (same day)
 * getDaysDifference('23:00', '01:00', 1560) // 1 (26h of trip = next day)
 * getDaysDifference('23:00', '23:30', 1470) // 1 (24h30 of trip = next day)
 */
export function getDaysDifference(departureTime: string, arrivalTime: string, duration: number): number {
  if (!departureTime || !arrivalTime || !duration) return 0;

  // if arrival time is 00:00, it's the next day
  if (arrivalTime === '00:00:00' || arrivalTime === '00:00') return 0;
  
  // Calculate the number of complete days based on the duration
  const daysFromDuration = Math.floor(duration / (24 * 60));
  
  // Convert hours to minutes since midnight
  const [depHours, depMinutes] = departureTime.split(':').map(Number);
  const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
  
  const depTotalMinutes = depHours * 60 + depMinutes;
  const arrTotalMinutes = arrHours * 60 + arrMinutes;
  
  // if arrival time is less than departure time, it's the next day
  const extraDay = arrTotalMinutes < depTotalMinutes ? 1 : 0;
  
  return daysFromDuration + extraDay;
}
