# Plan de migration vers une interface fonctionnelle

## Objectif

Ce document décrit la stratégie de transformation du dépôt `Suivi-de-projet` :

- depuis un socle de fichiers TSV,
- vers une modélisation TypeScript,
- puis vers une base PostgreSQL,
- et enfin vers une interface fonctionnelle exploitable.

L’objectif est de conserver la valeur des fichiers existants tout en construisant progressivement une application métier durable.

---

# 1. État actuel

Le dépôt contient déjà un socle de données métier structuré.

## Fichiers disponibles

### Données métier
- `data/projet.tsv`
- `data/phases_mop.tsv`
- `data/lots.tsv`
- `data/planning.tsv`
- `data/intervenants.tsv`
- `data/marches.tsv`
- `data/cctp.tsv`
- `data/dqe.tsv`
- `data/situations.tsv`
- `data/chantier_cr.tsv`
- `data/actions_chantier.tsv`
- `data/facturation_client.tsv`
- `data/suivi_financier.tsv`
- `data/documents.tsv`
- `data/ccap.tsv`
- `data/tableau_de_bord.tsv`

### Configuration
- `config/parametres.json`

### Documentation cible
- `docs/schema-donnees.md`
- `docs/regles-de-gestion.md`
- `docs/plan-migration.md`

---

# 2. Vision cible

L’architecture cible est une application capable de :

- lire et valider les données existantes,
- les afficher dans une interface métier,
- permettre la saisie et la mise à jour,
- calculer les indicateurs,
- exporter les données,
- migrer progressivement vers une base relationnelle.

---

# 3. Principes de migration

## 3.1 Ne pas casser la base existante
Les fichiers TSV doivent rester exploitables pendant toute la transition.

## 3.2 Conserver les identifiants métier
Les IDs existants doivent rester stables :
- `PRJ-001`
- `LOT-A-01`
- `PH-ESQ`
- `INT-001`
- etc.

## 3.3 Séparer les responsabilités
La future application doit distinguer :
- lecture/import,
- validation,
- logique métier,
- persistance,
- affichage.

## 3.4 Procéder par étapes courtes
La migration doit être incrémentale, avec une valeur utilisable à chaque phase.

---

# 4. Étape 1 — Stabilisation des données TSV

## Objectif
Faire des TSV une base d’entrée fiable.

## Travaux
- figer les noms de colonnes,
- vérifier les formats de date,
- homogénéiser les statuts,
- homogénéiser les types d’identifiants,
- clarifier les relations inter-fichiers.

## Résultat attendu
Des fichiers :
- stables,
- importables,
- validables automatiquement.

---

# 5. Étape 2 — Documentation de référence

## Objectif
Formaliser le modèle avant d’écrire le code.

## Documents à maintenir
- `docs/schema-donnees.md`
- `docs/regles-de-gestion.md`
- `docs/plan-migration.md`

## Résultat attendu
Une base documentaire claire pour :
- le développement,
- les imports,
- les validations,
- les futures migrations.

---

# 6. Étape 3 — Modélisation TypeScript

## Objectif
Créer les types métier correspondant aux fichiers.

## Cibles
Créer un type ou une interface par entité métier.

### Exemples
- `Projet`
- `PhaseMop`
- `Lot`
- `PlanningTask`
- `Intervenant`
- `Marche`
- `ArticleCctp`
- `LigneDqe`
- `Situation`
- `CompteRenduChantier`
- `ActionChantier`
- `FactureClient`
- `SuiviFinancier`
- `DocumentProjet`
- `ClauseCcap`
- `IndicateurTableauDeBord`

## Résultat attendu
Un modèle TypeScript aligné sur les fichiers métier.

---

# 7. Étape 4 — Lecture et parsing des TSV

## Objectif
Permettre à l’application de charger les fichiers existants.

## Modules à créer
- parseur TSV générique,
- normaliseur d’en-têtes,
- convertisseur de types,
- validateur de structure.

## Fichiers techniques suggérés
- `src/import/parseTsv.ts`
- `src/import/normalizeHeaders.ts`
- `src/import/convertTypes.ts`
- `src/import/loadProjectData.ts`

## Résultat attendu
Une lecture fiable des fichiers `data/*.tsv`.

---

# 8. Étape 5 — Validation métier

## Objectif
Contrôler la cohérence des données avant affichage ou persistance.

## Contrôles à implémenter
- identifiants uniques,
- références existantes,
- formats corrects,
- montants cohérents,
- avancement cohérent,
- statuts autorisés.

## Approche recommandée
- validations techniques simples au parsing,
- validations métier dans un module dédié.

## Fichiers techniques suggérés
- `src/validation/validateProjet.ts`
- `src/validation/validateLots.ts`
- `src/validation/validateRelations.ts`
- `src/validation/validateFinance.ts`

## Résultat attendu
Une couche de contrôle réutilisable par l’import, l’API et l’interface.

---

# 9. Étape 6 — Création d’un noyau métier applicatif

## Objectif
Créer un cœur d’application indépendant de l’interface.

## Contenu
- types métier,
- fonctions de calcul,
- agrégations,
- projections pour l’interface.

## Exemples de calculs
- montant TTC,
- reste à payer,
- avancement global,
- synthèse financière par lot,
- indicateurs de tableau de bord.

## Résultat attendu
Une logique métier réutilisable côté serveur ou côté client.

---

# 10. Étape 7 — Première interface en lecture seule

## Objectif
Afficher les données du projet sans encore modifier les fichiers.

## Écrans minimum recommandés
1. tableau de bord
2. fiche projet
3. phases MOP
4. lots
5. planning
6. intervenants
7. marchés
8. CCTP
9. DQE
10. situations
11. chantier
12. documents
13. facturation
14. suivi financier

## Bénéfice
Obtenir rapidement une interface utile tout en limitant le risque.

---

# 11. Étape 8 — Migration vers PostgreSQL

## Objectif
Passer d’un stockage fichier à un stockage relationnel.

## Stratégie
Les TSV deviennent :
- soit une source d’import initial,
- soit un format d’échange,
- mais plus la source principale.

## Tables cibles
- `projets`
- `phases_mop`
- `lots`
- `planning`
- `intervenants`
- `marches`
- `cctp_articles`
- `dqe_lignes`
- `situations`
- `chantier_cr`
- `actions_chantier`
- `facturation_client`
- `suivi_financier`
- `documents`
- `ccap_clauses`
- `tableau_de_bord`

## Résultat attendu
Une persistance plus robuste, relationnelle et évolutive.

---

# 12. Étape 9 — API applicative

## Objectif
Exposer les données et les opérations métier via une API.

## Stack recommandée
- Node.js
- TypeScript
- PostgreSQL

## Choix possibles pour l’accès aux données
- `pg`
- `Kysely`
- `Prisma`

## Endpoints types
- `GET /projects`
- `GET /projects/:id`
- `GET /projects/:id/lots`
- `GET /projects/:id/phases`
- `GET /projects/:id/planning`
- `GET /projects/:id/intervenants`
- `GET /projects/:id/documents`
- `GET /projects/:id/situations`
- `GET /projects/:id/finance`

## Évolution future
- `POST`
- `PUT`
- `PATCH`
- `DELETE` si nécessaire

---

# 13. Étape 10 — Interface complète avec édition

## Objectif
Permettre la saisie et la modification des données.

## Fonctionnalités à ajouter
- formulaires métier,
- tableaux filtrables,
- validations en ligne,
- calculs automatiques,
- recherche multi-critères,
- pièces jointes,
- export.

## Priorités d’édition recommandées
1. projet
2. lots
3. planning
4. intervenants
5. actions chantier
6. documents
7. situations
8. facturation

---

# 14. Étape 11 — Import / export

## Objectif
Conserver la compatibilité terrain avec les fichiers.

## À prévoir
- import TSV,
- export TSV,
- export Excel,
- export PDF,
- éventuellement import CSV.

## Bénéfice
Permettre une transition progressive sans rupture avec les habitudes existantes.

---

# 15. Étape 12 — Industrialisation

## Objectif
Transformer l’outil en véritable application métier.

## Fonctionnalités futures
- authentification,
- gestion des rôles,
- journal des modifications,
- notifications,
- historique,
- GED,
- versionnage documentaire,
- génération de tableaux de bord automatiques.

---

# 16. Architecture cible recommandée

## Structure applicative suggérée

```text
src/
  domain/
    projet/
    phases/
    lots/
    planning/
    intervenants/
    marches/
    cctp/
    dqe/
    situations/
    chantier/
    facturation/
    documents/
    reporting/
  import/
  validation/
  services/
  infrastructure/
    db/
    repositories/
  ui/
```

---

# 17. Ordre de réalisation recommandé

## Phase A — socle documentaire
1. finaliser les docs
2. stabiliser les colonnes
3. stabiliser les IDs

## Phase B — socle TypeScript
4. créer les types métier
5. créer le parseur TSV
6. créer les validateurs

## Phase C — socle interface
7. construire une interface lecture seule
8. afficher les écrans clés

## Phase D — socle base de données
9. créer le schéma PostgreSQL
10. créer l’import initial
11. brancher l’API

## Phase E — interface complète
12. formulaires d’édition
13. calculs automatiques
14. exports

## Phase F — industrialisation
15. authentification
16. droits
17. historique
18. GED

---

# 18. Priorité immédiate recommandée

La meilleure suite maintenant est :

## 1. Déposer les trois documents de référence
- `docs/schema-donnees.md`
- `docs/regles-de-gestion.md`
- `docs/plan-migration.md`

## 2. Créer le noyau TypeScript initial
- `src/domain/types.ts`
- `src/import/parseTsv.ts`
- `src/import/loadProjectData.ts`

## 3. Créer une première vue de lecture
- projet
- lots
- planning
- intervenants
- suivi financier

---

# 19. Risques à éviter

## 19.1 Renommage tardif des colonnes
Changer les colonnes après démarrage du code rendra la migration plus coûteuse.

## 19.2 Multiplication des formats
Il faut éviter :
- plusieurs formats de dates,
- plusieurs formats monétaires,
- plusieurs conventions de statuts.

## 19.3 Logique métier dispersée
Les calculs doivent être regroupés dans des services ou modules dédiés.

## 19.4 Dépendance forte à un format fichier
Les TSV doivent rester un support, pas devenir une contrainte bloquante.

---

# 20. Résumé

Le projet dispose déjà d’un socle de données métier très solide.  
La stratégie recommandée est :

1. stabiliser,
2. documenter,
3. typer,
4. parser,
5. valider,
6. afficher,
7. migrer,
8. industrialiser.

Cette progression permet de construire une interface fonctionnelle sans perdre l’investissement réalisé dans les fichiers existants.
