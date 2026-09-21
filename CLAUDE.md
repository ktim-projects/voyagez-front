# Notes pour les agents travaillant sur ce dépôt

## Le produit en une phrase

Geyavo compare des horaires de cars interurbains en Côte d'Ivoire et dans la
sous-région. **Il n'y a ni réservation ni paiement** : le parcours s'arrête à
l'affichage des départs puis des coordonnées téléphoniques de la compagnie
(`DepartureDetailSidebar.vue`). Les textes du site ont été alignés là-dessus :
ne pas réintroduire de promesse de réservation, de paiement ou de billet.

## Commandes

```bash
pnpm dev
pnpm lint            # doit rester à 0 erreur
pnpm typecheck       # doit rester à 0 erreur
pnpm test:run        # doit rester vert
pnpm build
```

Avant de pousser : `pnpm lint && pnpm typecheck && pnpm test:run && pnpm build`.

`pnpm build` ne type pas le code : seul `typecheck` le fait. C'est lui qui
attrape les ruptures d'API des SDK serveur, que rien n'exécute au build.

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

**Aucune clé d'API ne part au navigateur.** Les routes `/api/` sont servies
au site via un contrôle first-party (`server/utils/first-party.ts`), pas via
une clé — elle serait lisible dans le HTML. Ce contrôle bloque l'usage
cross-site depuis un navigateur, pas un client HTTP quelconque : la vraie
frontière sur les données est le RLS Supabase
(`supabase/migrations/enable_rls.sql`, **à appliquer manuellement**).

**La page compagnie prend les couleurs de la compagnie.** `brand_color` est
une donnée de la base : aucune classe Tailwind ne peut en dépendre, elle
serait purgée. `utils/company-theme.ts` en dérive une palette complète —
l'encre est recalculée par luminance pour rester lisible sur une marque
claire comme sur une marque sombre — et la page la pose en variables CSS
(`--gy-*`). Les composants s'y réfèrent, jamais à une classe construite.
Seul le thème clair existe ; le site n'a de toute façon pas d'interrupteur
de mode sombre branché.

**Les pages compagnie sont dérivées, pas saisies.** `/compagnies/:slug` ne
montre que des données stockées (`company`) ou comptées depuis `departure`
(`server/utils/company-aggregate.ts`) : villes, trajets, gares, fourchette de
prix. Cette page est faite pour être partagée par la compagnie elle-même, une
valeur estimée ou un avis inventé s'y verrait. Ne rien y afficher qui ne soit
pas en base. Le slug est dérivé du nom (`utils/companies.ts`), la colonne
`company.slug` ne sert qu'à figer une URL déjà partagée.

**Les données se chargent au rendu serveur.** Résultats de recherche et
articles passent par `useAsyncData` : le HTML servi contient les départs et
le contenu des articles. Tout le SEO du projet en dépend — ne pas revenir à
un `onMounted` pour ces écrans. Les filtres, le tri et la pagination restent
impératifs, ils n'ont lieu qu'après interaction.

## Conventions

- Commentaires et libellés en français, code et noms de variables en anglais.
- ESLint en flat config (`eslint.config.mjs`) ; `.eslintrc` n'est plus lu.
- Les `any` restants sont des warnings assumés, concentrés sur les réponses
  Supabase non typées et les mocks de tests. Ne pas en ajouter ailleurs.
- `achives/` (sic) contient des pages archivées hors build : ne pas s'en
  servir comme référence de code actuel. Elles sont exclues via
  `ignore` et `typescript.tsConfig.exclude` dans `nuxt.config.ts`.
- Tailwind est volontairement resté en v3 : la v4 change de modèle de
  configuration (CSS-first) et renomme des utilitaires, ce qui demande une
  migration à part avec vérification visuelle.

## Git

**Branches.** Une branche par pull request, nommée `<type>/<description>` en
kebab-case, avec les types de Conventional Commits : `feat`, `fix`, `chore`,
`docs`, `refactor`, `test`, `perf`, `ci`, `build`.

```
feat/dark-mode-toggle
fix/city-slug-mismatch
chore/upgrade-nuxt
```

Pas de branche fourre-tout : une intention par branche, donc par PR.

**Commits.** Conventional Commits : `<type>(<scope>): <sujet>`, sujet à
l'impératif et en minuscule. Le corps explique le *pourquoi*, pas le *quoi*
— le diff dit déjà le quoi.

**Pull requests.** Titre **et** description **en anglais**, y compris quand
les commits et les commentaires du code sont en français. Le titre suit la
même forme que les commits. La description dit ce qui change, pourquoi, et
ce qui a été vérifié.
