/**
 * Génération dynamique du sitemap.xml
 * Pour aider Google à indexer toutes les pages du site
 */

import { useCities } from '~/composables/useCities';

export default defineEventHandler((event) => {
  const { cities } = useCities();
  
  // URL de base du site
  const baseUrl = 'https://geyavo.com';
  
  // Date de dernière modification (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];
  
  // Pages statiques
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/destinations-populaires', priority: '0.9', changefreq: 'weekly' },
  ];
  
  // Générer toutes les combinaisons de villes pour les résultats
  const cityRoutes: Array<{ url: string; priority: string; changefreq: string }> = [];
  
  // Utiliser toutes les villes (52) - Bien en dessous des limites Google (50 000 URLs)
  // Cela génère ~2 655 URLs, ce qui est parfaitement acceptable
  const allCityNames = cities.map(city => city.name);
  
  allCityNames.forEach((from: string) => {
    allCityNames.forEach((to: string) => {
      if (from !== to) {
        const fromSlug = from.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
        const toSlug = to.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
        
        cityRoutes.push({
          url: `/results/${fromSlug}/${toSlug}`,
          priority: '0.7',
          changefreq: 'daily'
        });
      }
    });
  });
  
  // Construire le XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${cityRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Définir les headers appropriés
  setResponseHeader(event, 'Content-Type', 'application/xml');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600'); // Cache 1h
  
  return sitemap;
});
