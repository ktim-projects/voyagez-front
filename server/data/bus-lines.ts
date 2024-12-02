import type { BusLine } from './types';

export const busLines: BusLine[] = [
  {
    id: '1',
    number: '81',
    name: 'Yopougon - Adjamé',
    color: '#e11d48',
    stops: [
      {
        id: '1',
        name: 'Yopougon Siporex',
        latitude: 5.3365,
        longitude: -4.0888,
        description: 'Station Siporex'
      },
      {
        id: '2',
        name: 'Yopougon Attié',
        latitude: 5.3399,
        longitude: -4.0799,
        description: 'Quartier Attié'
      },
      {
        id: '3',
        name: 'Banco 2',
        latitude: 5.3412,
        longitude: -4.0701,
        description: 'Arrêt Banco 2'
      },
      {
        id: '4',
        name: 'Adjamé Centre',
        latitude: 5.3419,
        longitude: -4.0698,
        description: 'Centre commercial Adjamé'
      }
    ]
  },
  {
    id: '2',
    number: '28',
    name: 'Yopougon - Plateau',
    color: '#2563eb',
    stops: [
      {
        id: '5',
        name: 'Yopougon Gare',
        latitude: 5.3372,
        longitude: -4.0885,
        description: 'Gare principale'
      },
      {
        id: '6',
        name: 'Adjamé Forum',
        latitude: 5.3456,
        longitude: -4.0334,
        description: 'Forum des marchés'
      },
      {
        id: '7',
        name: 'Plateau Tour F',
        latitude: 5.3499,
        longitude: -4.0199,
        description: 'Tour F'
      }
    ]
  },
  {
    id: '3',
    number: '83',
    name: 'Abobo - Adjamé',
    color: '#16a34a',
    stops: [
      {
        id: '8',
        name: 'Abobo Gare',
        latitude: 5.4302,
        longitude: -4.0168,
        description: 'Gare principale d\'Abobo'
      },
      {
        id: '9',
        name: 'N\'Dotré',
        latitude: 5.4201,
        longitude: -4.0234,
        description: 'Quartier N\'Dotré'
      },
      {
        id: '10',
        name: 'Adjamé Nord',
        latitude: 5.3567,
        longitude: -4.0234,
        description: 'Station Nord Adjamé'
      }
    ]
  },
  {
    id: '4',
    number: '12',
    name: 'Cocody - Plateau',
    color: '#9333ea',
    stops: [
      {
        id: '11',
        name: 'Riviera 2',
        latitude: 5.3789,
        longitude: -3.9889,
        description: 'Station Riviera 2'
      },
      {
        id: '12',
        name: 'Danga',
        latitude: 5.3678,
        longitude: -3.9967,
        description: 'Carrefour Danga'
      },
      {
        id: '13',
        name: 'Saint Jean',
        latitude: 5.3567,
        longitude: -4.0089,
        description: 'Église Saint Jean'
      },
      {
        id: '14',
        name: 'Plateau Dokui',
        latitude: 5.3499,
        longitude: -4.0156,
        description: 'Station Dokui'
      }
    ]
  },
  {
    id: '5',
    number: '22',
    name: 'Koumassi - Marcory',
    color: '#ea580c',
    stops: [
      {
        id: '15',
        name: 'Koumassi Grand Marché',
        latitude: 5.3012,
        longitude: -3.9789,
        description: 'Grand Marché'
      },
      {
        id: '16',
        name: 'Palais des Sports',
        latitude: 5.3156,
        longitude: -3.9845,
        description: 'Complexe Sportif'
      },
      {
        id: '17',
        name: 'Cap Sud',
        latitude: 5.3234,
        longitude: -3.9923,
        description: 'Centre Commercial'
      }
    ]
  }
];