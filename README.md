# Geyavo — Comparateur de transport en Côte d'Ivoire

[![CI](https://github.com/ktim-projects/voyagez-front/actions/workflows/ci.yml/badge.svg)](https://github.com/ktim-projects/voyagez-front/actions/workflows/ci.yml)

Application web de recherche et de comparaison de trajets en car interurbain
en Côte d'Ivoire et dans la sous-région (Ghana, Mali, Burkina Faso, Guinée,
Togo, Bénin).

L'utilisateur recherche un trajet ville à ville, filtre les départs (prix,
compagnie, plage horaire, catégorie de confort, commune d'Abidjan) et obtient
les coordonnées de la compagnie. **La réservation et le paiement en ligne ne
font pas partie du périmètre actuel.**

## 🚀 Stack

| Domaine | Choix |
|---|---|
| Framework | Nuxt 3 (SSR), Vue 3, TypeScript strict |
| État | Pinia + `pinia-plugin-persistedstate` |
| Styles | TailwindCSS (`darkMode: 'class'`) |
| Données | Supabase (`departure`, `company`, `articles`, `news`) |
| Emails | Brevo (newsletter, formulaire de contact) + webhook Slack |
| Tests | Vitest + happy-dom |
| Hébergement | Vercel (preset Nitro `vercel`) |

## 📦 Installation

```bash
pnpm install
cp .env.example .env   # puis renseigner les valeurs
```

Les variables attendues sont décrites dans `.env.example`. Les clés d'API ne
servent qu'aux appels serveur à serveur et aux routes d'administration : le
site lui-même n'en utilise aucune. Pour en générer une :

```bash
node -p "'gyv_' + require('crypto').randomBytes(32).toString('base64url')"
```

⚠️ Le RLS Supabase (`supabase/migrations/enable_rls.sql`) n'est pas appliqué
automatiquement. Sans lui, la clé anonyme — publique par conception — donne
un accès complet en lecture et en écriture aux tables. À relire puis appliquer
sur un environnement de test avant la production.

## 🛠️ Développement

```bash
pnpm dev          # http://localhost:3000
pnpm lint         # ESLint 9 (flat config)
pnpm lint:fix     # corrige ce qui est auto-corrigeable
```

## 🧪 Tests

```bash
pnpm test           # lance la suite une fois
pnpm test:dev       # mode watch
pnpm test:ui        # interface interactive
pnpm test:coverage  # rapport de couverture (coverage/)
```

Un hook `pre-commit` (husky) lance les tests puis `lint-staged` sur les
fichiers modifiés.

## 🏗️ Production

```bash
pnpm build
pnpm preview
```

Le déploiement est automatique : la CI tourne sur `main`, puis le workflow
`deploy.yml` publie sur Vercel.

## 📁 Organisation

```
components/      composants UI (CarSearchResults est le cœur de la recherche)
composables/     useCities (liste des villes), useSecureApi (appels API)
pages/           routes ; /results/[from]/[to] est la page de résultats
server/api/      endpoints Nitro (recherche, articles, contact, newsletter)
server/middleware/  sécurité (clé d'API, rate limiting) et en-têtes HTTP
stores/          état de recherche Pinia
utils/           slugs de villes, confort, communes, formatage
achives/         pages archivées (auth, réservation) — hors build
```

⚠️ Les villes vivent à deux endroits qui doivent rester synchronisés :
`composables/useCities.ts` (ce que voit l'autocomplete) et `utils/cities.ts`
(`citySlugMap`, qui fait foi pour les URLs et la validation). Des tests
verrouillent leur cohérence — en ajoutant une ville, mettre à jour les deux.

## 🤝 Contribution

1. Créer une branche depuis `main`
2. Vérifier avant de pousser :

```bash
pnpm lint && pnpm test:run && pnpm build
```
