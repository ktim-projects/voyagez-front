# VoyagezCi - Plateforme de Réservation de Transport

[![CI](https://github.com/VOTRE_USERNAME/voyagez-front/workflows/CI/badge.svg)](https://github.com/VOTRE_USERNAME/voyagez-front/actions)
[![Tests](https://github.com/VOTRE_USERNAME/voyagez-front/workflows/Tests/badge.svg)](https://github.com/VOTRE_USERNAME/voyagez-front/actions)
[![Coverage](https://img.shields.io/badge/coverage-89%20tests-brightgreen)](./tests)

Plateforme web moderne pour la réservation de trajets en car et bus en Côte d'Ivoire.

## 🚀 Technologies

- **Framework:** Nuxt 3
- **Language:** TypeScript
- **State Management:** Pinia
- **Styling:** TailwindCSS
- **Testing:** Vitest
- **CI/CD:** GitHub Actions

## 📊 Tests

- **89 tests unitaires** passant avec succès
- **3 fichiers de tests** (composables, stores, utils)
- **Couverture de code** générée automatiquement

Voir la [documentation des tests](./tests/README.md) pour plus d'informations.

## 📦 Installation

Installer les dépendances avec pnpm :

```bash
pnpm install
```

## 🛠️ Développement

Lancer le serveur de développement sur http://localhost:3000 :

```bash
pnpm dev
```

## 🧪 Tests

### Lancer tous les tests
```bash
pnpm test:run
```

### Mode watch (développement)
```bash
pnpm test
```

### Interface UI interactive
```bash
pnpm test:ui
```

### Générer le rapport de couverture
```bash
pnpm test:coverage
```

## 🏗️ Production

Build de l'application pour la production :

```bash
pnpm build
```

Prévisualiser le build de production localement :

```bash
pnpm preview
```

## 📚 Documentation

- [Tests Unitaires](./tests/README.md)
- [GitHub Actions CI/CD](./.github/README.md)
- [Nuxt 3 Documentation](https://nuxt.com/docs)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

Assurez-vous que tous les tests passent avant de soumettre une PR :
```bash
pnpm test:run && pnpm build
```
