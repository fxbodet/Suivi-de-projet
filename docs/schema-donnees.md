# Schéma de données du projet `Suivi-de-projet`

## Objectif

Ce document décrit la structure des fichiers de données du projet.  
Il sert de référence pour :

- la future interface fonctionnelle,
- l’import/export TSV,
- la modélisation TypeScript,
- la migration vers PostgreSQL,
- les validations métier.

---

## Organisation générale

Le projet est structuré autour de trois familles de fichiers :

- `data/` : données métier
- `config/` : paramètres de fonctionnement
- `docs/` : documentation de référence

---

# 1. Fichiers de données métier

## 1.1 `data/projet.tsv`

### Rôle
Contient les informations générales du projet.

### Colonnes
- `Projet_ID`
- `Nom_Projet`
- `Description`
- `Adresse`
- `Ville`
- `Code_Postal`
- `Maitre_Ouvrage`
- `Moe`
- `Date_Debut`
- `Date_Fin_Prevue`
- `Budget_Prevu_HT`
- `Statut_Projet`
- `Type_Projet`
- `ERP`

### Clé principale
- `Projet_ID`

### Exemple
- `PRJ-001`

---

## 1.2 `data/phases_mop.tsv`

### Rôle
Décrit les phases MOP du projet.

### Colonnes
- `Phase_ID`
- `Projet_ID`
- `Ordre`
- `Code_Phase`
- `Nom_Phase`
- `Description`
- `Date_Debut_Prevue`
- `Date_Fin_Prevue`
- `Date_Debut_Reelle`
- `Date_Fin_Reelle`
- `Statut_Phase`
- `Livrable_Principal`
- `Validation_MOA`

### Clé principale
- `Phase_ID`

### Clé étrangère
- `Projet_ID -> projet.Projet_ID`

---

## 1.3 `data/lots.tsv`

### Rôle
Liste les lots du projet, avec leur structure économique de base.

### Colonnes
- `Lot_ID`
- `Projet_ID`
- `Ensemble`
- `Code_Lot`
- `Numero_Lot`
- `Designation_Lot`
- `Entreprise_ID`
- `Montant_Marche_HT`
- `TVA`
- `Montant_Marche_TTC`
- `Date_Notification`
- `Date_Demarrage`
- `Date_Reception_Prevue`
- `Date_Reception_Reelle`
- `Avancement_Pourcent`
- `Statut_Lot`
- `Commentaire`

### Clé principale
- `Lot_ID`

### Clé étrangère
- `Projet_ID -> projet.Projet_ID`

---

## 1.4 `data/planning.tsv`

### Rôle
Contient les tâches de planning, les jalons, les dépendances et les priorités.

### Colonnes
- `Tache_ID`
- `Projet_ID`
- `Phase_ID`
- `Lot_ID`
- `Nom_Tache`
- `Description`
- `Date_Debut_Prevue`
- `Date_Fin_Prevue`
- `Date_Debut_Reelle`
- `Date_Fin_Reelle`
- `Duree_Jours`
- `Statut_Tache`
- `Priorite`
- `Dependance`
- `Jalon`
- `Responsable`
- `Commentaire`

### Clé principale
- `Tache_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Phase_ID -> phases_mop.Phase_ID`
- `Lot_ID -> lots.Lot_ID`

---

## 1.5 `data/intervenants.tsv`

### Rôle
Référence les acteurs du projet.

### Colonnes
- `Intervenant_ID`
- `Projet_ID`
- `Type_Intervenant`
- `Raison_Sociale`
- `Contact`
- `Fonction`
- `Email`
- `Telephone`
- `Adresse`
- `SIRET`
- `Assurance`
- `Lot_ID`
- `Actif`
- `Commentaire`

### Clé principale
- `Intervenant_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Lot_ID -> lots.Lot_ID` (optionnel)

---

## 1.6 `data/marches.tsv`

### Rôle
Suit les contrats et marchés par lot.

### Colonnes
- `Marche_ID`
- `Projet_ID`
- `Lot_ID`
- `Entreprise_ID`
- `Type_Document`
- `Reference`
- `Date_Contrat`
- `Date_Notification`
- `Montant_Initial_HT`
- `Montant_Avenants_HT`
- `Montant_Actualise_HT`
- `Delai_Execution`
- `Retenue_Garantie`
- `Penalites`
- `Commentaire`

### Clé principale
- `Marche_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Lot_ID -> lots.Lot_ID`
- `Entreprise_ID -> intervenants.Intervenant_ID`

---

## 1.7 `data/cctp.tsv`

### Rôle
Stocke les articles techniques du CCTP.

### Colonnes
- `Article_ID`
- `Projet_ID`
- `Lot_ID`
- `Chapitre`
- `Sous_Chapitre`
- `Reference_Article`
- `Designation`
- `Description`
- `Unite`
- `Observation`
- `Actif`

### Clé principale
- `Article_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Lot_ID -> lots.Lot_ID`

---

## 1.8 `data/dqe.tsv`

### Rôle
Contient les lignes du DQE.

### Colonnes
- `Ligne_DQE_ID`
- `Projet_ID`
- `Lot_ID`
- `Article_ID`
- `Reference_Article`
- `Designation`
- `Unite`
- `Quantite_Prevue`
- `PU_HT`
- `Montant_HT`
- `TVA`
- `Montant_TTC`
- `Entreprise_ID`
- `Commentaire`

### Clé principale
- `Ligne_DQE_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Lot_ID -> lots.Lot_ID`
- `Article_ID -> cctp.Article_ID`
- `Entreprise_ID -> intervenants.Intervenant_ID`

---

## 1.9 `data/situations.tsv`

### Rôle
Suit les situations de travaux et l’avancement économique.

### Colonnes
- `Situation_ID`
- `Projet_ID`
- `Lot_ID`
- `Ligne_DQE_ID`
- `Periode`
- `Date_Situation`
- `Quantite_Periode`
- `Quantite_Cumulee`
- `Avancement_Pourcent`
- `Montant_Periode_HT`
- `Montant_Cumule_HT`
- `Reste_A_Facturer_HT`
- `Validee`
- `Date_Validation`
- `Commentaire`

### Clé principale
- `Situation_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Lot_ID -> lots.Lot_ID`
- `Ligne_DQE_ID -> dqe.Ligne_DQE_ID`

---

## 1.10 `data/chantier_cr.tsv`

### Rôle
Historise les comptes rendus de chantier.

### Colonnes
- `CR_ID`
- `Projet_ID`
- `Numero_CR`
- `Date_Reunion`
- `Lieu`
- `Redacteur`
- `Participants`
- `Absents`
- `Avancement_Global`
- `Points_Bloquants`
- `Decisions`
- `Date_Prochaine_Reunion`
- `Lien_PDF`

### Clé principale
- `CR_ID`

### Clé étrangère
- `Projet_ID -> projet.Projet_ID`

---

## 1.11 `data/actions_chantier.tsv`

### Rôle
Suit les actions issues des réunions de chantier.

### Colonnes
- `Action_ID`
- `CR_ID`
- `Projet_ID`
- `Lot_ID`
- `Description_Action`
- `Responsable`
- `Date_Demande`
- `Date_Echeance`
- `Statut_Action`
- `Priorite`
- `Date_Cloture`
- `Commentaire`

### Clé principale
- `Action_ID`

### Clés étrangères
- `CR_ID -> chantier_cr.CR_ID`
- `Projet_ID -> projet.Projet_ID`
- `Lot_ID -> lots.Lot_ID`

---

## 1.12 `data/facturation_client.tsv`

### Rôle
Suit la facturation côté client / maîtrise d’ouvrage.

### Colonnes
- `Facture_ID`
- `Projet_ID`
- `Client`
- `Type_Facturation`
- `Phase_ID`
- `Reference_Facture`
- `Date_Facture`
- `Date_Echeance`
- `Montant_HT`
- `TVA`
- `Montant_TTC`
- `Montant_Regle`
- `Date_Reglement`
- `Reste_Du`
- `Statut_Facture`
- `Commentaire`

### Clé principale
- `Facture_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Phase_ID -> phases_mop.Phase_ID`

---

## 1.13 `data/suivi_financier.tsv`

### Rôle
Fournit une synthèse financière par lot.

### Colonnes
- `Suivi_ID`
- `Projet_ID`
- `Lot_ID`
- `Budget_Initial_HT`
- `Montant_Marche_HT`
- `Montant_Avenants_HT`
- `Montant_Engage_HT`
- `Montant_Situations_Validees_HT`
- `Montant_Regle_HT`
- `Reste_A_Engager_HT`
- `Reste_A_Regler_HT`
- `Ecart_Budget_Marche_HT`
- `Ecart_Marche_Realise_HT`

### Clé principale
- `Suivi_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Lot_ID -> lots.Lot_ID`

---

## 1.14 `data/documents.tsv`

### Rôle
Référence les documents du projet.

### Colonnes
- `Document_ID`
- `Projet_ID`
- `Phase_ID`
- `Lot_ID`
- `Type_Document`
- `Reference`
- `Version`
- `Date_Document`
- `Auteur`
- `Lien_Fichier`
- `Statut_Validation`

### Clé principale
- `Document_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Phase_ID -> phases_mop.Phase_ID`
- `Lot_ID -> lots.Lot_ID`

---

## 1.15 `data/ccap.tsv`

### Rôle
Stocke les clauses administratives.

### Colonnes
- `Clause_ID`
- `Projet_ID`
- `Lot_ID`
- `Chapitre`
- `Reference_Clause`
- `Designation`
- `Description`
- `Observation`

### Clé principale
- `Clause_ID`

### Clés étrangères
- `Projet_ID -> projet.Projet_ID`
- `Lot_ID -> lots.Lot_ID`

---

## 1.16 `data/tableau_de_bord.tsv`

### Rôle
Contient des indicateurs de synthèse.

### Colonnes
- `Indicateur`
- `Valeur`
- `Unite`
- `Categorie`
- `Commentaire`

### Clé principale
- `Indicateur`

---

# 2. Fichiers de configuration

## 2.1 `config/parametres.json`

### Rôle
Centralise les paramètres globaux du projet.

### Contenu attendu
- statuts projet
- statuts tâche
- priorités
- taux de TVA
- types de tâches
- phases MOP

### Usage
- validation de saisie,
- listes déroulantes de l’interface,
- cohérence des imports.

---

# 3. Relations principales

## Projet
Le fichier `projet.tsv` est la racine fonctionnelle du système.

Tous les fichiers métier comportent ou peuvent comporter un `Projet_ID`.

---

## Relations clés

- `phases_mop.Projet_ID -> projet.Projet_ID`
- `lots.Projet_ID -> projet.Projet_ID`
- `planning.Projet_ID -> projet.Projet_ID`
- `intervenants.Projet_ID -> projet.Projet_ID`
- `marches.Projet_ID -> projet.Projet_ID`
- `cctp.Projet_ID -> projet.Projet_ID`
- `dqe.Projet_ID -> projet.Projet_ID`
- `situations.Projet_ID -> projet.Projet_ID`
- `chantier_cr.Projet_ID -> projet.Projet_ID`
- `actions_chantier.Projet_ID -> projet.Projet_ID`
- `facturation_client.Projet_ID -> projet.Projet_ID`
- `suivi_financier.Projet_ID -> projet.Projet_ID`
- `documents.Projet_ID -> projet.Projet_ID`
- `ccap.Projet_ID -> projet.Projet_ID`

---

## Relations secondaires

- `planning.Phase_ID -> phases_mop.Phase_ID`
- `planning.Lot_ID -> lots.Lot_ID`
- `intervenants.Lot_ID -> lots.Lot_ID`
- `marches.Lot_ID -> lots.Lot_ID`
- `marches.Entreprise_ID -> intervenants.Intervenant_ID`
- `cctp.Lot_ID -> lots.Lot_ID`
- `dqe.Lot_ID -> lots.Lot_ID`
- `dqe.Article_ID -> cctp.Article_ID`
- `dqe.Entreprise_ID -> intervenants.Intervenant_ID`
- `situations.Ligne_DQE_ID -> dqe.Ligne_DQE_ID`
- `actions_chantier.CR_ID -> chantier_cr.CR_ID`
- `actions_chantier.Lot_ID -> lots.Lot_ID`
- `facturation_client.Phase_ID -> phases_mop.Phase_ID`
- `documents.Phase_ID -> phases_mop.Phase_ID`
- `documents.Lot_ID -> lots.Lot_ID`
- `ccap.Lot_ID -> lots.Lot_ID`

---

# 4. Identifiants métier recommandés

## Projet
- `PRJ-001`

## Phase
- `PH-ESQ`
- `PH-APS`
- `PH-APD`
- `PH-PRO`
- `PH-ACT`
- `PH-VISA`
- `PH-DET`
- `PH-AOR`

## Lot
- `LOT-A-01`
- `LOT-B-03`

## Intervenant
- `INT-001`

## Marché
- `MAR-001`

## Article CCTP
- `ART-001`

## Ligne DQE
- `DQE-001`

## Situation
- `SIT-001`

## Compte rendu
- `CR-001`

## Action chantier
- `ACT-001`

## Facture
- `FAC-001`

## Suivi financier
- `SF-001`

## Document
- `DOC-001`

## Clause CCAP
- `CCAP-001`

---

# 5. Principes de modélisation pour l’interface

## Source de vérité actuelle
Les fichiers TSV sont la source de données initiale.

## Évolution prévue
Le modèle doit pouvoir être migré sans rupture vers :
- des types TypeScript,
- une base PostgreSQL,
- une API métier,
- une interface web complète.

## Règles de stabilité
- conserver les noms de colonnes
- conserver les IDs métier
- conserver les relations logiques
- normaliser les dates au format `YYYY-MM-DD`
- normaliser les montants en numérique simple
- éviter les renommages de colonnes après démarrage du code

---

# 6. Priorités pour la suite

## Documentation à produire ensuite
- `docs/regles-de-gestion.md`
- `docs/plan-migration.md`

## Développement technique à prévoir
- types TypeScript par entité
- parseur TSV
- validateur métier
- schéma PostgreSQL
- import initial
- interface de consultation et d’édition

---

# 7. Résumé

Le dépôt contient désormais une structure de données cohérente pour piloter :

- un projet,
- ses phases MOP,
- ses lots,
- son planning,
- ses intervenants,
- ses marchés,
- ses pièces techniques,
- son suivi de travaux,
- son suivi financier,
- sa documentation,
- ses indicateurs.

Ce schéma constitue la base de référence pour la future interface fonctionnelle.
