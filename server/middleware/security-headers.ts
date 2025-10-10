/**
 * Middleware de sécurité - En-têtes HTTP
 * 
 * Ce middleware ajoute des en-têtes de sécurité HTTP essentiels
 * pour protéger l'application contre diverses attaques.
 */

export default defineEventHandler((event) => {
  // 1. HSTS - Force HTTPS
  // Durée : 1 an (31536000 secondes)
  // includeSubDomains : Applique aussi aux sous-domaines
  setResponseHeader(
    event,
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // 2. CSP - Content Security Policy
  // Définit les sources de contenu autorisées
  const cspDirectives = [
    "default-src 'self'",                                    // Par défaut : seulement notre domaine
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vercel.live", // Scripts : Nuxt + Vercel Analytics
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Styles : notre domaine + Google Fonts
    "font-src 'self' https://fonts.gstatic.com data:",      // Fonts : notre domaine + Google Fonts
    "img-src 'self' data: https: blob:",                    // Images : notre domaine + data URLs + HTTPS
    "connect-src 'self' https://geyavo.com/api https://*.vercel.app https://overpass-api.de/api/interpreter", // APIs autorisées
    "frame-ancestors 'none'",                                // Pas d'iframe (équivalent X-Frame-Options)
    "base-uri 'self'",                                       // URLs de base autorisées
    "form-action 'self'",                                    // Soumission de formulaires
    "upgrade-insecure-requests"                              // Upgrade HTTP → HTTPS automatiquement
  ];
  
  setResponseHeader(
    event,
    'Content-Security-Policy',
    cspDirectives.join('; ')
  );

  // 3. X-Content-Type-Options
  // Empêche le navigateur de deviner le type MIME
  setResponseHeader(
    event,
    'X-Content-Type-Options',
    'nosniff'
  );

  // 4. X-Frame-Options
  // Empêche l'affichage dans une iframe (protection clickjacking)
  setResponseHeader(
    event,
    'X-Frame-Options',
    'DENY'
  );

  // 5. X-XSS-Protection
  // Active le filtre XSS du navigateur
  setResponseHeader(
    event,
    'X-XSS-Protection',
    '1; mode=block'
  );

  // 6. Referrer-Policy
  // Contrôle les informations envoyées dans le header Referer
  setResponseHeader(
    event,
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  );

  // 7. Permissions-Policy (anciennement Feature-Policy)
  // Désactive les fonctionnalités non utilisées
  const permissionsDirectives = [
    'geolocation=(self)',           // Géolocalisation : seulement notre domaine
    'microphone=()',                // Microphone : désactivé
    'camera=()',                    // Caméra : désactivée
    'payment=()',                   // API Payment : désactivée
    'usb=()',                       // USB : désactivé
    'magnetometer=()',              // Magnétomètre : désactivé
    'gyroscope=()',                 // Gyroscope : désactivé
    'accelerometer=()'              // Accéléromètre : désactivé
  ];
  
  setResponseHeader(
    event,
    'Permissions-Policy',
    permissionsDirectives.join(', ')
  );

  // 8. X-Permitted-Cross-Domain-Policies
  // Empêche Adobe Flash/PDF d'accéder aux données
  setResponseHeader(
    event,
    'X-Permitted-Cross-Domain-Policies',
    'none'
  );

  // 9. X-DNS-Prefetch-Control
  // Contrôle le prefetch DNS
  setResponseHeader(
    event,
    'X-DNS-Prefetch-Control',
    'on'
  );
});
