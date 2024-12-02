import type { CarJourney } from './types';
import { carCompanies } from './companies';

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
  },
  {
    id: '2',
    operator: carCompanies[1],
    origin: 'Abidjan',
    destination: 'Yamoussoukro',
    departureTime: '08:30',
    arrivalTime: '11:30',
    duration: '3h',
    price: 4000,
    date: '2024-11-29'
  },
  {
    id: '3',
    operator: carCompanies[2],
    origin: 'Abidjan',
    destination: 'San Pedro',
    departureTime: '06:00',
    arrivalTime: '12:00',
    duration: '6h',
    price: 8000,
    date: '2024-11-29'
  },
  {
    id: '4',
    operator: carCompanies[0],
    origin: 'Bouaké',
    destination: 'Abidjan',
    departureTime: '07:30',
    arrivalTime: '12:00',
    duration: '4h 30min',
    price: 6000,
    date: '2024-11-29'
  },
  {
    id: '5',
    operator: carCompanies[1],
    origin: 'Yamoussoukro',
    destination: 'Abidjan',
    departureTime: '09:00',
    arrivalTime: '12:00',
    duration: '3h',
    price: 4000,
    date: '2024-11-30'
  },
  {
    id: '6',
    operator: carCompanies[2],
    origin: 'San Pedro',
    destination: 'Abidjan',
    departureTime: '07:00',
    arrivalTime: '13:00',
    duration: '6h',
    price: 8000,
    date: '2024-11-30'
  },
  {
    id: '7',
    operator: carCompanies[0],
    origin: 'Abidjan',
    destination: 'Korhogo',
    departureTime: '06:00',
    arrivalTime: '14:00',
    duration: '8h',
    price: 10000,
    date: '2024-11-29'
  },
  {
    id: '8',
    operator: carCompanies[1],
    origin: 'Korhogo',
    destination: 'Abidjan',
    departureTime: '06:30',
    arrivalTime: '14:30',
    duration: '8h',
    price: 10000,
    date: '2024-11-30'
  },
  {
    id: '9',
    operator: carCompanies[2],
    origin: 'Yamoussoukro',
    destination: 'Bouaké',
    departureTime: '08:00',
    arrivalTime: '10:00',
    duration: '2h',
    price: 3000,
    date: '2024-11-29'
  },
  {
    id: '10',
    operator: carCompanies[0],
    origin: 'Bouaké',
    destination: 'Yamoussoukro',
    departureTime: '14:00',
    arrivalTime: '16:00',
    duration: '2h',
    price: 3000,
    date: '2024-11-30'
  }
];