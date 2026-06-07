# Règles de gestion du projet `Suivi-de-projet`

## Objectif

Ce document formalise les règles métier applicables aux fichiers de données du projet.  
Il sert de référence pour :

- la saisie manuelle,
- les imports TSV,
- les validations de l’interface,
- les contrôles TypeScript,
- la future migration vers PostgreSQL.

---

# 1. Principes généraux

## 1.1 Unicité des identifiants
Chaque entité métier doit posséder un identifiant unique.

### Exemples
- `Projet_ID = PRJ-001`
- `Lot_ID = LOT-A-01`
- `Intervenant_ID = INT-001`
- `Marche_ID = MAR-001`
- `Article_ID = ART-001`
- `Ligne_DQE_ID = DQE-001`
- `Situation_ID = SIT-001`
- `CR_ID = CR-001`
- `Action_ID = ACT-001`
- `Facture_ID = FAC-001`
- `Suivi_ID = SF-001`
- `Document_ID = DOC-001`
- `Clause_ID = CCAP-001`

### Règle
Un identifiant ne doit jamais être réutilisé pour une autre entité.

---

## 1.2 Références inter-fichiers
Toute clé étrangère doit référencer une valeur existante dans le fichier cible.

### Exemples
- un `Projet_ID` utilisé dans `lots.tsv` doit exister dans `projet.tsv`
- un `Lot_ID` utilisé dans `dqe.tsv` doit exister dans `lots.tsv`
- un `Article_ID` utilisé dans `dqe.tsv` doit exister dans `cctp.tsv`
- un `Ligne_DQE_ID` utilisé dans `situations.tsv` doit exister dans `dqe.tsv`

### Règle
Aucune référence orpheline ne doit être acceptée.

---

## 1.3 Formats de dates
Toutes les dates doivent être saisies au format :

`YYYY-MM-DD`

### Exemples valides
- `2026-06-07`
- `2026-09-15`

### Exemples invalides
- `07/06/2026`
- `6 juin 2026`
- `2026/06/07`

---

## 1.4 Valeurs numériques
Les valeurs numériques doivent être stockées sous forme simple et exploitable.

### Règles
- pas d’espace dans les nombres,
- pas de symbole monétaire dans les colonnes numériques,
- utiliser le point comme séparateur décimal si nécessaire.

### Exemples valides
- `0`
- `1250`
- `0.2`
- `15234.75`

### Exemples invalides
- `15 234,75 €`
- `1,250.00`
- `12%`

---

## 1.5 Valeurs booléennes / logiques
Les champs logiques doivent être normalisés.

### Valeurs recommandées
- `Oui`
- `Non`

Ou selon le besoin métier :
- `true`
- `false`

### Règle
Un même champ ne doit pas mélanger plusieurs conventions.

---

# 2. Règles sur le projet

## 2.1 Existence du projet
Le fichier `projet.tsv` doit contenir au moins une ligne projet valide avant toute autre saisie liée.

### Règle
Aucun lot, aucune phase, aucun document ou marché ne doit exister sans projet.

---

## 2.2 Statut projet
Le statut projet doit appartenir à la liste autorisée définie dans `config/parametres.json`.

### Exemples possibles
- `PREVU`
- `EN_COURS`
- `TERMINE`
- `SUSPENDU`

---

# 3. Règles sur les phases MOP

## 3.1 Référencement du projet
Chaque phase MOP doit être liée à un projet existant.

## 3.2 Ordre des phases
Le champ `Ordre` doit permettre de classer les phases dans l’ordre chronologique métier.

### Ordre recommandé
1. ESQ
2. APS
3. APD
4. PRO
5. ACT
6. VISA
7. DET
8. AOR

## 3.3 Cohérence des dates
Si les dates sont renseignées :
- `Date_Debut_Prevue <= Date_Fin_Prevue`
- `Date_Debut_Reelle <= Date_Fin_Reelle`

---

# 4. Règles sur les lots

## 4.1 Un lot appartient à un projet
Chaque lot doit référencer un `Projet_ID` valide.

## 4.2 Numérotation
Le `Lot_ID`, le `Code_Lot` et le `Numero_Lot` doivent être cohérents entre eux.

### Exemple
- `Lot_ID = LOT-A-01`
- `Code_Lot = LOT 01`
- `Numero_Lot = 01`

## 4.3 Montants
Si `Montant_Marche_HT` et `TVA` sont renseignés, alors `Montant_Marche_TTC` doit être cohérent.

### Formule
`Montant_Marche_TTC = Montant_Marche_HT * (1 + TVA)`

## 4.4 Avancement
`Avancement_Pourcent` doit être compris entre `0` et `100`.

---

# 5. Règles sur le planning

## 5.1 Appartenance
Une tâche de planning doit toujours être rattachée à un projet.

## 5.2 Références facultatives
Une tâche peut être rattachée :
- à une phase,
- à un lot,
- aux deux,
- ou seulement au projet si elle est transversale.

## 5.3 Durée
Si les dates sont renseignées, la durée doit être cohérente.

### Règle
`Date_Fin_Prevue >= Date_Debut_Prevue`

## 5.4 Statut
Le statut d’une tâche doit appartenir aux valeurs autorisées du paramétrage.

## 5.5 Priorité
La priorité doit appartenir aux valeurs autorisées.

### Exemples
- `BASSE`
- `MOYENNE`
- `HAUTE`
- `CRITIQUE`

---

# 6. Règles sur les intervenants

## 6.1 Projet obligatoire
Chaque intervenant doit être lié à un projet.

## 6.2 Type d’intervenant
Le type doit être normalisé.

### Exemples
- `MAITRE_OUVRAGE`
- `MOE`
- `ENTREPRISE`
- `BET`
- `BUREAU_CONTROLE`
- `SPS`
- `FOURNISSEUR`

## 6.3 Lot facultatif
Un intervenant peut être rattaché à un lot spécifique, mais ce n’est pas obligatoire.

## 6.4 Actif
Le champ `Actif` doit être renseigné de manière homogène.

---

# 7. Règles sur les marchés

## 7.1 Références obligatoires
Un marché doit référencer :
- un projet,
- un lot,
- une entreprise/intervenant si connue.

## 7.2 Montants
Les montants doivent être numériques et cohérents.

### Formule recommandée
`Montant_Actualise_HT = Montant_Initial_HT + Montant_Avenants_HT`

## 7.3 Délais
Le `Delai_Execution` doit être exprimé dans une unité homogène si le champ est utilisé.

---

# 8. Règles sur le CCTP

## 8.1 Projet et lot
Chaque article CCTP doit être rattaché à un projet et à un lot.

## 8.2 Référence d’article
La `Reference_Article` doit être stable et non ambiguë.

## 8.3 Activation
Le champ `Actif` doit permettre d’identifier si l’article est utilisable ou archivé.

---

# 9. Règles sur le DQE

## 9.1 Références obligatoires
Une ligne DQE doit référencer :
- un projet,
- un lot,
- idéalement un article CCTP.

## 9.2 Quantités et prix
Les colonnes suivantes doivent être numériques :
- `Quantite_Prevue`
- `PU_HT`
- `Montant_HT`
- `TVA`
- `Montant_TTC`

## 9.3 Formules
### Montant HT
`Montant_HT = Quantite_Prevue * PU_HT`

### Montant TTC
`Montant_TTC = Montant_HT * (1 + TVA)`

## 9.4 Entreprise
Si `Entreprise_ID` est renseigné, il doit exister dans `intervenants.tsv`.

---

# 10. Règles sur les situations

## 10.1 Référencement DQE
Chaque situation doit pointer vers une ligne DQE existante.

## 10.2 Cohérence des quantités
### Règles
- `Quantite_Periode >= 0`
- `Quantite_Cumulee >= Quantite_Periode`
- `Avancement_Pourcent` compris entre `0` et `100`

## 10.3 Cohérence des montants
### Règles
- `Montant_Periode_HT >= 0`
- `Montant_Cumule_HT >= Montant_Periode_HT`
- `Reste_A_Facturer_HT >= 0`

## 10.4 Validation
Si `Validee = Oui`, alors `Date_Validation` devrait être renseignée.

---

# 11. Règles sur les comptes rendus chantier

## 11.1 Projet obligatoire
Chaque compte rendu doit être rattaché à un projet.

## 11.2 Numéro de CR
Le `Numero_CR` doit être unique à l’intérieur d’un même projet.

## 11.3 Avancement global
`Avancement_Global` doit être compris entre `0` et `100`.

---

# 12. Règles sur les actions chantier

## 12.1 Origine
Une action chantier doit idéalement provenir d’un compte rendu.

## 12.2 Références
Une action doit référencer :
- un projet,
- éventuellement un lot,
- éventuellement un compte rendu.

## 12.3 Statut
Le statut doit appartenir à une liste autorisée.

### Exemples
- `PREVU`
- `EN_COURS`
- `BLOQUE`
- `TERMINE`
- `ANNULE`

## 12.4 Priorité
La priorité doit être normalisée.

## 12.5 Échéance
Si la date d’échéance est dépassée et que l’action n’est pas clôturée, elle peut être considérée en retard.

---

# 13. Règles sur la facturation client

## 13.1 Références
Une facture client doit être liée à un projet.  
Elle peut aussi être rattachée à une phase.

## 13.2 Montants
Les colonnes suivantes doivent être cohérentes :
- `Montant_HT`
- `TVA`
- `Montant_TTC`
- `Montant_Regle`
- `Reste_Du`

### Formules
- `Montant_TTC = Montant_HT * (1 + TVA)`
- `Reste_Du = Montant_TTC - Montant_Regle`

## 13.3 Statut facture
Le statut doit être normalisé.

### Exemples
- `PREVU`
- `EMISE`
- `PARTIELLEMENT_REGLEE`
- `REGLEE`
- `EN_RETARD`

---

# 14. Règles sur le suivi financier

## 14.1 Références
Le suivi financier est rattaché à :
- un projet,
- un lot.

## 14.2 Cohérences de synthèse
Les champs de synthèse doivent rester cohérents avec les marchés et les situations.

### Exemples
- `Montant_Marche_HT` doit être cohérent avec `marches.tsv`
- `Montant_Situations_Validees_HT` doit être cohérent avec `situations.tsv`

## 14.3 Écarts
Les écarts peuvent être calculés automatiquement.

### Exemples
- `Ecart_Budget_Marche_HT = Budget_Initial_HT - Montant_Marche_HT`
- `Ecart_Marche_Realise_HT = Montant_Marche_HT - Montant_Situations_Validees_HT`

---

# 15. Règles sur les documents

## 15.1 Projet obligatoire
Chaque document doit être rattaché à un projet.

## 15.2 Références facultatives
Un document peut être rattaché :
- à une phase,
- à un lot,
- aux deux,
- ou seulement au projet.

## 15.3 Type de document
Le type doit être normalisé.

### Exemples
- `NOTE`
- `CCTP`
- `CCAP`
- `DQE`
- `CR`
- `OS`
- `AVENANT`
- `FACTURE`
- `PV_RECEPTION`

## 15.4 Version
Le champ `Version` doit permettre de suivre l’évolution documentaire.

---

# 16. Règles sur le CCAP

## 16.1 Structure
Une clause CCAP doit être liée à un projet.  
Elle peut être globale ou rattachée à un lot.

## 16.2 Référence de clause
La `Reference_Clause` doit être stable pour permettre le suivi des versions.

---

# 17. Règles sur le tableau de bord

## 17.1 Nature
Le tableau de bord contient des indicateurs calculés ou saisis.

## 17.2 Unicité
Le champ `Indicateur` doit être unique si le fichier est utilisé comme référentiel principal.

## 17.3 Cohérence
Les indicateurs doivent être compatibles avec les autres fichiers métier.

### Exemples
- `Avancement_Projet` dérive des phases, lots ou planning
- `Budget_Engage` dérive des marchés
- `Reste_A_Regler` dérive de la facturation ou des situations
- `Actions_En_Retard` dérive des actions chantier

---

# 18. Règles de validation avant import dans l’interface

Avant import ou chargement dans l’application, les contrôles suivants doivent être appliqués :

## 18.1 Contrôles de structure
- présence du fichier attendu,
- présence de l’en-tête attendu,
- respect du nombre de colonnes,
- absence de colonnes inconnues si mode strict.

## 18.2 Contrôles de format
- dates valides,
- numériques valides,
- valeurs de statut autorisées,
- pourcentages valides.

## 18.3 Contrôles d’intégrité
- identifiants uniques,
- références existantes,
- absence de doublons incohérents,
- cohérence des relations inter-fichiers.

## 18.4 Contrôles métier
- montants cohérents,
- avancement cohérent,
- dépendances métier respectées.

---

# 19. Règles pour la future interface

## 19.1 Saisie assistée
Les champs de type :
- statut,
- priorité,
- type de document,
- type d’intervenant,
- phase,
- lot

doivent être saisis via listes contrôlées si possible.

## 19.2 Champs calculés
Les champs suivants devraient idéalement être calculés automatiquement dans l’interface :
- montants TTC,
- restes dus,
- écarts financiers,
- avancement,
- indicateurs de tableau de bord.

## 19.3 Historisation
Toute modification future dans une interface avancée devrait pouvoir être historisée.

---

# 20. Résumé

Les règles de gestion ont pour objectif de garantir :

- la cohérence des fichiers TSV,
- la qualité des imports,
- la stabilité du modèle de données,
- la compatibilité future avec TypeScript et PostgreSQL,
- la construction d’une interface fonctionnelle fiable.
