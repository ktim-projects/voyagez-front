import type { BusRoute } from './types';

export const busRoutes: BusRoute[] = [
  {
    id: '1',
    from: 'Yopougon',
    to: 'Plateau',
    duration: '55 min',
    distance: '15.2 km',
    steps: [
      {
        type: 'walk',
        duration: '7 min',
        description: 'Marcher jusqu\'à l\'arrêt Yopougon Gare',
        color: '#666',
        path: [[5.3358, -4.0891], [5.3372, -4.0885]]
      },
      {
        type: 'bus',
        line: '81',
        duration: '25 min',
        description: 'Bus 81 direction Adjamé',
        color: '#e11d48',
        path: [[5.3372, -4.0885], [5.3399, -4.0799], [5.3412, -4.0701]]
      },
      {
        type: 'walk',
        duration: '3 min',
        description: 'Marcher jusqu\'à l\'arrêt Adjamé Centre',
        color: '#666',
        path: [[5.3412, -4.0701], [5.3419, -4.0698]]
      },
      {
        type: 'bus',
        line: '28',
        duration: '15 min',
        description: 'Bus 28 direction Plateau',
        color: '#2563eb',
        path: [[5.3419, -4.0698], [5.3456, -4.0334], [5.3499, -4.0199]]
      }
    ]
  }
];