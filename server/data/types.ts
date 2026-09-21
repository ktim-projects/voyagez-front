
export type { City } from '~/types';

export interface CarCompany {
  id: string;
  name: string;
  logo_url?: string;
  address?: string;
  contact: string;
  email?: string;
  services?: string[];
}

export interface Departure {
  id: string;
  operator: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration: number;
  price: number;
  date: string;
  company: CarCompany
  station: string;
  contacts?: string;
  comfort_info?: {
    category: string;
    details: string;
  }
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