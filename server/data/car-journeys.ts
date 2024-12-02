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
    date: '2024-12-01'
  },
  {
    id: '100',
    operator: carCompanies[0],
    origin: 'Abidjan',
    destination: 'Bouaké',
    departureTime: '18:00',
    arrivalTime: '22:30',
    duration: '4h 30min',
    price: 6000,
    date: '2024-12-01'
  },
  {
    id: '101',
    operator: carCompanies[0],
    origin: 'Abidjan',
    destination: 'Bouaké',
    departureTime: '06:00',
    arrivalTime: '10:30',
    duration: '4h 30min',
    price: 6000,
    date: '2024-12-02'
  },
  {
    id: '102',
    operator: carCompanies[2],
    origin: 'Abidjan',
    destination: 'Bouaké',
    departureTime: '18:00',
    arrivalTime: '22:30',
    duration: '4h 30min',
    price: 6000,
    date: '2024-12-02'
  },
  {
    id: '103',
    operator: carCompanies[2],
    origin: 'Abidjan',
    destination: 'Bouaké',
    departureTime: '18:00',
    arrivalTime: '22:30',
    duration: '4h 30min',
    price: 6000,
    date: '2024-12-01'
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
    date: '2024-12-01'
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
    date: '2024-12-01'
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
    date: '2024-12-01'
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
    date: '2024-12-02'
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
    date: '2024-12-02'
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
    date: '2024-12-01'
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
    date: '2024-12-02'
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
    date: '2024-12-01'
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
    date: '2024-12-02'
  },
  {
    id: '11',
    operator: carCompanies[1],
    origin: 'Yamoussoukro',
    destination: 'San Pedro',
    departureTime: '07:00',
    arrivalTime: '13:00',
    duration: '6h',
    price: 8000,
    date: '2024-12-01'
  },
  {
    id: '12',
    operator: carCompanies[2],
    origin: 'San Pedro',
    destination: 'Korhogo',
    departureTime: '07:00',
    arrivalTime: '13:00',
    duration: '6h',
    price: 8000,
    date: '2024-12-02'
  },
  {
    id: '13',
    operator: carCompanies[0],
    origin: 'Korhogo',
    destination: 'Yamoussoukro',
    departureTime: '07:00',
    arrivalTime: '13:00',
    duration: '6h',
    price: 8000,
    date: '2024-12-01'
  },
  {
    id: '14',
    operator: carCompanies[1],
    origin: 'Yamoussoukro',
    destination: 'Bouaké',
    departureTime: '07:00',
    arrivalTime: '09:00',
    duration: '2h',
    price: 3000,
    date: '2024-12-02'
  },
  {
    id: '15',
    operator: carCompanies[2],
    origin: 'Bouaké',
    destination: 'San Pedro',
    departureTime: '07:00',
    arrivalTime: '13:00',
    duration: '6h',
    price: 8000,
    date: '2024-12-01'
  },
  {
    id: '16',
    operator: carCompanies[0],
    origin: 'San Pedro',
    destination: 'Korhogo',
    departureTime: '07:00',
    arrivalTime: '13:00',
    duration: '6h',
    price: 8000,
    date: '2024-12-02'
  },
  {
    id: '17',
    operator: carCompanies[1],
    origin: 'Korhogo',
    destination: 'Yamoussoukro',
    departureTime: '07:00',
    arrivalTime: '13:00',
    duration: '6h',
    price: 8000,
    date: '2024-12-01'
  },
  {
    id: '18',
    operator: carCompanies[2],
    origin: 'Yamoussoukro',
    destination: 'Bouaké',
    departureTime: '07:00',
    arrivalTime: '09:00',
    duration: '2h',
    price: 3000,
    date: '2024-12-02'
  },
  // Abidjan vers Bouaké
  { id: '101', operator: carCompanies[0], origin: 'Abidjan', destination: 'Bouaké', departureTime: '06:00', arrivalTime: '10:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '102', operator: carCompanies[0], origin: 'Abidjan', destination: 'Bouaké', departureTime: '08:00', arrivalTime: '12:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '103', operator: carCompanies[0], origin: 'Abidjan', destination: 'Bouaké', departureTime: '10:00', arrivalTime: '14:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '104', operator: carCompanies[2], origin: 'Abidjan', destination: 'Bouaké', departureTime: '12:00', arrivalTime: '16:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '105', operator: carCompanies[1], origin: 'Abidjan', destination: 'Bouaké', departureTime: '14:00', arrivalTime: '18:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '106', operator: carCompanies[1], origin: 'Abidjan', destination: 'Bouaké', departureTime: '16:00', arrivalTime: '20:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '107', operator: carCompanies[1], origin: 'Abidjan', destination: 'Bouaké', departureTime: '18:00', arrivalTime: '22:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '108', operator: carCompanies[1], origin: 'Abidjan', destination: 'Bouaké', departureTime: '20:00', arrivalTime: '00:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '109', operator: carCompanies[2], origin: 'Abidjan', destination: 'Bouaké', departureTime: '07:00', arrivalTime: '11:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },
  { id: '110', operator: carCompanies[2], origin: 'Abidjan', destination: 'Bouaké', departureTime: '09:00', arrivalTime: '13:30', duration: '4h 30min', price: 6000, date: '2024-12-01' },

  // Bouaké vers Abidjan
  { id: '201', operator: carCompanies[0], origin: 'Bouaké', destination: 'Abidjan', departureTime: '06:30', arrivalTime: '11:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '202', operator: carCompanies[0], origin: 'Bouaké', destination: 'Abidjan', departureTime: '08:30', arrivalTime: '13:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '203', operator: carCompanies[0], origin: 'Bouaké', destination: 'Abidjan', departureTime: '10:30', arrivalTime: '15:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '204', operator: carCompanies[0], origin: 'Bouaké', destination: 'Abidjan', departureTime: '12:30', arrivalTime: '17:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '205', operator: carCompanies[2], origin: 'Bouaké', destination: 'Abidjan', departureTime: '14:30', arrivalTime: '19:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '206', operator: carCompanies[1], origin: 'Bouaké', destination: 'Abidjan', departureTime: '16:30', arrivalTime: '21:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '207', operator: carCompanies[1], origin: 'Bouaké', destination: 'Abidjan', departureTime: '18:30', arrivalTime: '23:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '208', operator: carCompanies[1], origin: 'Bouaké', destination: 'Abidjan', departureTime: '20:30', arrivalTime: '01:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '209', operator: carCompanies[2], origin: 'Bouaké', destination: 'Abidjan', departureTime: '07:30', arrivalTime: '12:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },
  { id: '210', operator: carCompanies[2], origin: 'Bouaké', destination: 'Abidjan', departureTime: '09:30', arrivalTime: '14:00', duration: '4h 30min', price: 6000, date: '2024-12-02' },

  // Autres combinaisons (exemples)
  { id: '301', operator: carCompanies[0], origin: 'San Pedro', destination: 'Daloa', departureTime: '06:00', arrivalTime: '10:00', duration: '4h 00min', price: 5000, date: '2024-12-03' },
  { id: '302', operator: carCompanies[1], origin: 'Korhogo', destination: 'Abidjan', departureTime: '09:00', arrivalTime: '17:00', duration: '8h 00min', price: 10000, date: '2024-12-03' },
  { id: '303', operator: carCompanies[2], origin: 'Yamoussoukro', destination: 'Man', departureTime: '08:00', arrivalTime: '12:00', duration: '4h 00min', price: 7000, date: '2024-12-03' },
];