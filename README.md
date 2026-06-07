# Suivi de projet - exports HTML

Ce projet permet de générer plusieurs vues HTML à partir des données du projet.

## Génération des pages

```bash
npm run export:index-html
npm run export:dashboard-html
npm run export:lots-html
npm run export:validation-html
npm run export:intervenants-html
npm run export:actions-html
npm run export:documents-html
npm run export:finances-html
```

## Pages générées

Les fichiers sont générés dans le dossier `output/` :

- `index.html` : page d'accueil
- `dashboard.html` : tableau de bord projet
- `lots.html` : vue des lots
- `validation.html` : vue de validation
- `intervenants.html` : vue des intervenants
- `actions.html` : vue des actions chantier
- `documents.html` : vue des documents
- `finances.html` : vue financière

## Style partagé

Toutes les pages HTML principales utilisent le fichier commun :

- `output/styles.css`
