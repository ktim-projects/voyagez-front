# Revue rapide de la codebase

## Bonnes pratiques à adopter

1. **Réactiver un linting exécutable avec ESLint v9 (flat config)**  
   Le projet utilise `.eslintrc.json`, mais ESLint v9 attend `eslint.config.*`. Cela empêche d'appliquer les règles `no-unused-vars` de façon fiable.

2. **Ajouter une vérification CI minimale**  
   Exécuter systématiquement `pnpm test:run` et une commande de lint fonctionnelle à chaque PR pour éviter l'accumulation de code mort.

3. **Documenter les conventions de composants Nuxt auto-importés**  
   Clarifier quand un composant doit être chargé automatiquement vs import explicite pour faciliter la détection des composants réellement inutilisés.

4. **Faire une revue trimestrielle des composants non référencés**  
   Utiliser une vérification par recherche de références (`rg`) puis valider manuellement avant suppression pour éviter d'éliminer des composants encore utilisés dynamiquement.

## Code inutilisé supprimé

Les composants suivants n'avaient aucune référence dans le projet (vérifié via recherche textuelle globale), ils ont été supprimés :

- `components/BusStopSelect.vue`
- `components/LatestNews.vue`
- `components/RouteDetails.vue`
- `components/SessionExpiredModal.vue`
- `components/SortMenu.vue`
- `components/TheBreadcrumb.vue`
- `components/icons/ArrowLeft.vue`

## Vérifications effectuées

- Les tests unitaires passent après suppression (`pnpm test:run`).
