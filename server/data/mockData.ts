// Types
export interface City {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface BusLine {
  id: string;
  number: string;
  name: string;
  color: string;
  stops: BusStop[];
}

export interface CarCompany {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  services: string[];
}

export interface CarJourney {
  id: string;
  operator: CarCompany;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

// Mock Data
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
  }
];

export const carJourneys: CarJourney[] = [
  {
    id: '1',
    operator: carCompanies[0],
    origin: 'Abidjan',
    destination: 'Bouaké',
    departureTime: '07:00',
    arrivalTime: '11:30',
    duration: '4h 30min',
    price: 6000,
    date: '2024-11-29'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Guide complet du transport en commun à Abidjan',
    slug: 'guide-transport-commun-abidjan',
    excerpt: 'Découvrez comment naviguer efficacement dans le système de transport en commun d\'Abidjan.',
    content: `
      <p>Le système de transport en commun d'Abidjan est un réseau complexe mais efficace qui dessert l'ensemble de la ville.</p>
    `,
    image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7',
    author: 'Konan Kouamé',
    date: '15 janvier 2024',
    readTime: '8 min de lecture',
    category: 'Guide'
  }
];

export const cities: City[] = [
  { name: 'Abidjan', region: 'Lagunes', latitude: 5.3599517, longitude: -4.0082563 },
  { name: 'Bouaké', region: 'Vallée du Bandama', latitude: 7.6907799, longitude: -5.0303319 },
  { name: 'Yamoussoukro', region: 'Lacs', latitude: 6.8276228, longitude: -5.2893433 },
  { name: 'San Pedro', region: 'Bas-Sassandra', latitude: 4.7453841, longitude: -6.6375657 },
  { name: 'Korhogo', region: 'Savanes', latitude: 9.4579388, longitude: -5.6294793 }
];