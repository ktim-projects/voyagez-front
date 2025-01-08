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

export interface BusRoute {
  id: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  steps: {
    type: 'walk' | 'bus';
    line?: string;
    duration: string;
    description: string;
    color: string;
    path: [number, number][];
  }[];
}

export interface CarCompany {
  id: string;
  name: string;
  logo_url?: string;
  address?: string;
  contact: string;
  email?: string;
  services?: string[];
}

export interface CarJourney {
  id: string;
  operator: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  date: string;
  company: CarCompany
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