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
    logo: 'https://voyagez.ci/sites/default/files/2024-01/utb.jpg',
    address: 'Gare Routière Yopougon',
    phone: '+225 27 20 25 30 35',
    email: 'contact@utb.ci',
    services: ['Climatisation', 'WiFi', 'Service VIP']
  },
  {
    id: '3',
    name: 'GTS',
    logo: 'https://voyagez.ci/sites/default/files/2024-01/gts.jpg',
    address: 'Gare Routière Abobo',
    phone: '+225 27 20 35 45 55',
    email: 'contact@gts.ci',
    services: ['Climatisation', 'Snacks', 'TV']
  }
];