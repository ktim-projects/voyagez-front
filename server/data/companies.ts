import type { CarCompany } from './types';

export const carCompanies: CarCompany[] = [
  {
    id: '1',
    name: 'Sido Transport',
    logo: 'https://voyagez.ci/sites/default/files/2024-01/319392087_146385934825398_5230852105866240533_n.jpg',
    address: 'Gare Routière Adjamé',
    phone: '+225 27 20 30 40 50',
    email: 'contact@sido-transport.ci',
    services: ['Climatisation', 'WiFi', 'Prises électriques', 'Toilettes']
  },
  {
    id: '2',
    name: 'UTB',
    logo: 'https://voyagez.ci/sites/default/files/2023-10/327445526_694574005455320_1425887416035583379_n.jpg',
    address: 'Gare Routière Yopougon',
    phone: '+225 27 20 25 30 35',
    email: 'contact@utb.ci',
    services: ['Climatisation', 'WiFi', 'Service VIP']
  },
  {
    id: '3',
    name: 'ART Luxury bus',
    logo: 'https://voyagez.ci/sites/default/files/2023-11/382492942_190577917385965_2785413616857961412_n.jpg',
    address: 'Gare Routière Abobo',
    phone: '+225 27 20 35 45 55',
    email: 'contact@art-luxury.ci',
    services: ['Climatisation', 'Snacks', 'TV', 'Petit déjeuner', 'Toilettes']
  }
];