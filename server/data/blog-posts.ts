import type { BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Guide complet du transport en commun à Abidjan',
    slug: 'guide-transport-commun-abidjan',
    excerpt: 'Découvrez comment naviguer efficacement dans le système de transport en commun d\'Abidjan.',
    content: `
      <p>Le système de transport en commun d'Abidjan est un réseau complexe mais efficace qui dessert l'ensemble de la ville. Dans ce guide, nous allons explorer les différentes options disponibles pour se déplacer dans la capitale économique de la Côte d'Ivoire.</p>
      
      <h2>Les bus de la SOTRA</h2>
      <p>La Société des Transports Abidjanais (SOTRA) est le principal opérateur de bus à Abidjan. Avec plus de 100 lignes, elle couvre l'ensemble de la ville et ses banlieues.</p>
      
      <h2>Les taxis-compteurs</h2>
      <p>Les taxis orange, équipés de compteurs, sont une option fiable pour des trajets directs. Ils sont particulièrement utiles pour les zones non desservies par les bus.</p>
      
      <h2>Les woro-woros</h2>
      <p>Ces taxis collectifs, reconnaissables à leurs couleurs distinctives selon les communes, sont une alternative économique pour les trajets courts.</p>
    `,
    image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7',
    author: 'Konan Kouamé',
    date: '15 janvier 2024',
    readTime: '8 min de lecture',
    category: 'Guide'
  },
  {
    id: '2',
    title: 'Les nouvelles lignes de bus à Abidjan en 2024',
    slug: 'nouvelles-lignes-bus-abidjan-2024',
    excerpt: 'La SOTRA annonce l\'ouverture de nouvelles lignes de bus pour mieux desservir la population.',
    content: `
      <p>Dans le cadre de son plan de modernisation, la SOTRA a annoncé l'ouverture de plusieurs nouvelles lignes de bus à Abidjan. Ces nouvelles routes visent à améliorer la connectivité entre les différents quartiers de la ville.</p>
      
      <h2>Nouvelles lignes</h2>
      <ul>
        <li>Ligne 84 : Yopougon - Port-Bouët</li>
        <li>Ligne 92 : Abobo - Bingerville</li>
        <li>Ligne 76 : Cocody - Koumassi</li>
      </ul>
      
      <h2>Impact sur la mobilité</h2>
      <p>Ces nouvelles lignes devraient réduire significativement le temps de trajet pour de nombreux usagers et désengorger certains axes très fréquentés.</p>
    `,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e',
    author: 'Aminata Touré',
    date: '10 janvier 2024',
    readTime: '5 min de lecture',
    category: 'Actualités'
  },
  {
    id: '3',
    title: 'Comment économiser sur vos trajets en car',
    slug: 'economiser-trajets-car',
    excerpt: 'Découvrez nos astuces pour réduire le coût de vos voyages en car interurbain.',
    content: `
      <p>Voyager en car est déjà une option économique, mais il existe plusieurs façons de réduire davantage vos dépenses de transport. Voici nos conseils pour optimiser votre budget voyage.</p>
      
      <h2>Réserver à l'avance</h2>
      <p>Les compagnies de transport proposent souvent des tarifs préférentiels pour les réservations anticipées. Planifiez vos voyages à l'avance pour bénéficier des meilleurs prix.</p>
      
      <h2>Comparer les compagnies</h2>
      <p>Utilisez des comparateurs de prix pour trouver les meilleures offres. Les tarifs peuvent varier significativement d'une compagnie à l'autre.</p>
      
      <h2>Programmes de fidélité</h2>
      <p>Inscrivez-vous aux programmes de fidélité des compagnies que vous utilisez régulièrement. Les points accumulés peuvent se transformer en réductions importantes.</p>
    `,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    author: 'Ibrahim Koné',
    date: '5 janvier 2024',
    readTime: '6 min de lecture',
    category: 'Conseils'
  },
  {
    id: '4',
    title: 'Les meilleurs itinéraires pour visiter la Côte d\'Ivoire',
    slug: 'meilleurs-itineraires-cote-ivoire',
    excerpt: 'Planifiez votre voyage à travers la Côte d\'Ivoire avec nos suggestions d\'itinéraires optimisés.',
    content: `
      <p>La Côte d'Ivoire regorge de destinations fascinantes à découvrir. Voici nos suggestions d'itinéraires pour explorer le pays de manière optimale.</p>
      
      <h2>Circuit Culturel : Abidjan - Yamoussoukro - Bouaké</h2>
      <p>Un parcours idéal pour découvrir l'histoire et la culture ivoirienne, en passant par la capitale politique et économique.</p>
      
      <h2>Route Côtière : Abidjan - Grand-Bassam - San Pedro</h2>
      <p>Longez la côte pour découvrir les plus belles plages du pays et l'histoire coloniale à Grand-Bassam.</p>
    `,
    image: 'https://images.unsplash.com/photo-1523365154888-8a758819b722',
    author: 'Marie Konaté',
    date: '2 janvier 2024',
    readTime: '10 min de lecture',
    category: 'Voyage'
  },
  {
    id: '5',
    title: 'Sécurité et confort : choisir sa compagnie de transport',
    slug: 'securite-confort-transport',
    excerpt: 'Guide pour choisir la meilleure compagnie de transport selon vos besoins.',
    content: `
      <p>Le choix de la compagnie de transport est crucial pour un voyage confortable et sécurisé. Voici les critères à prendre en compte.</p>
      
      <h2>État de la flotte</h2>
      <p>Vérifiez l'âge moyen des véhicules et leur entretien régulier. Une flotte moderne est généralement gage de sécurité.</p>
      
      <h2>Services à bord</h2>
      <p>Climatisation, WiFi, prises électriques... Comparez les services proposés pour un voyage plus agréable.</p>
      
      <h2>Réputation</h2>
      <p>Consultez les avis des voyageurs et la réputation de la compagnie en matière de ponctualité et de service client.</p>
    `,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    author: 'Seydou Bamba',
    date: '28 décembre 2023',
    readTime: '7 min de lecture',
    category: 'Conseils'
  }
];