/**
 * Liste des communes d'Abidjan
 */
export const ABIDJAN_COMMUNES = [
  'Abobo',
  'Adjamé',
  'Attécoubé',
  'Cocody',
  'Koumassi',
  'Marcory',
  'Plateau',
  'Port-Bouët',
  'Treichville',
  'Yopougon',
  'Bingerville',
  'Songon'
] as const;

export type CommuneAbidjan = typeof ABIDJAN_COMMUNES[number];

/**
 * Mapping des communes vers leurs quartiers
 * Permet de matcher les stations qui mentionnent des quartiers spécifiques
 */
export const COMMUNE_QUARTIERS: Record<CommuneAbidjan, string[]> = {
  'Abobo': [
    'Abobo',
    'Abobo Gare',
    'Abobo Baoulé',
    'Abobo PK18',
    'Abobo Avocatier',
    'Abobo Sagbé',
    'Abobo Té',
    'Abobo Derrière Rail',
    'Abobo Anador'
  ],
  'Adjamé': [
    'Adjamé',
    'Adjame',
    'Frat Mat',
    'FratMat',
    'Fraternité Matin',
  ],
  'Attécoubé': [
    'Attécoubé',
  ],
  'Cocody': [
    'Cocody',
  ],
  'Koumassi': [
    'Koumassi',
  ],
  'Marcory': [
    'Marcory',
  ],
  'Plateau': [
    'Plateau',
  ],
  'Port-Bouët': [
    'Port-Bouet',
    'Gonzagueville',
    'Gonzaque'
  ],
  'Treichville': [
    'Treichville',
  ],
  'Yopougon': [
    'Yopougon',
    'Yopou',
    'Gesco',
    'GESCO',
    'Siporex',
    'SIPOREX',
    'Niangon',
    'Selmer',
    'SELMER',
    'Maroc',
    'Sicogi',
    'Ananeraie',
    'Millionnaire',
    'Wassakara',
    'Koweït',
    'Koweit',
    'Andokoi',
    'Banco 2',
    'Toits Rouges',
    'Sideci',
    'Port-Bouet 2'
  ],
  'Bingerville': [
    'Bingerville',
  ],
  'Songon': [
    'Songon',
  ]
};
