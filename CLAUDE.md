# Notes pour les agents travaillant sur ce dépôt

## Le produit en une phrase

Geyavo compare des horaires de cars interurbains en Côte d'Ivoire et dans la
sous-région. **Il n'y a ni réservation ni paiement** : le parcours s'arrête à
l'affichage des départs puis des coordonnées téléphoniques de la compagnie
(`DepartureDetailSidebar.vue`). Plusieurs textes SEO parlent encore de
« réservation » — c'est un écart connu, pas une fonctionnalité oubliée.

## Commandes

```bash
pnpm dev
pnpm lint            # doit rester à 0 erreur
pnpm test:run        # doit rester vert
pnpm build
```

Avant de pousser : `pnpm lint && pnpm test:run && pnpm build`.

## Pièges connus

**Les villes vivent à deux endroits.** `composables/useCities.ts` alimente
l'autocomplete ; `utils/cities.ts` (`citySlugMap`) fait foi pour les URLs et
la validation. Une ville présente dans l'un mais pas résolvable par l'autre
devient silencieusement introuvable : la recherche redirige vers
`/destinations-populaires`. Des tests verrouillent l'invariant
`slugify(valeur) === clé` — les garder verts.

**Tailwind purge ce qu'il ne voit pas.** Les classes construites
dynamiquement (par ex. `utils/comfort.ts`) ne survivent que si leur fichier
est listé dans `content` de `tailwind.config.ts`. Ajouter un dossier qui
génère des classes ⇒ l'ajouter au `content`.

**La base stocke des slugs.** `departure.origin` et `departure.destination`
contiennent `abidjan`, `bouake`... et non les noms accentués. Le client
envoie donc des slugs à `/api/car/search`, et l'affichage repasse par
`getCityFromSlug()`.

**La clé d'API frontend est publique.** `runtimeConfig.public.apiKeyFrontend`
part dans le bundle client : le middleware `server/middleware/security.ts`
filtre les robots, pas un attaquant. La vraie protection des données doit
venir des RLS Supabase.

**Les données sont chargées côté client.** Résultats de recherche et articles
sont récupérés dans un `watch`/`onMounted`, pas via `useAsyncData` : le HTML
rendu par le serveur est vide. C'est le principal frein SEO du projet.

## Conventions

- Commentaires et libellés en français, code et noms de variables en anglais.
- ESLint 9 en flat config (`eslint.config.mjs`) ; `.eslintrc` n'est plus lu.
- Les `any` restants sont des warnings assumés, concentrés sur les réponses
  Supabase non typées et les mocks de tests. Ne pas en ajouter ailleurs.
- `achives/` (sic) contient des pages archivées hors build : ne pas s'en
  servir comme référence de code actuel.
