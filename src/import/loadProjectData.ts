import fs from "node:fs";
import path from "node:path";

import {
  ActionChantier,
  ArticleCctp,
  ClauseCcap,
  CompteRenduChantier,
  DocumentProjet,
  FactureClient,
  IndicateurTableauDeBord,
  Intervenant,
  LigneDqe,
  Lot,
  Marche,
  PhaseMop,
  PlanningTask,
  ProjectDataBundle,
  Projet,
  Situation,
  SuiviFinancier,
} from "../domain/types";
import { parseTsv, toNumber, toYesNo } from "./parseTsv";

function readTsvFile(basePath: string, relativePath: string) {
  const fullPath = path.join(basePath, relativePath);
  const content = fs.readFileSync(fullPath, "utf-8");
  return parseTsv(content);
}

export function loadProjectData(basePath: string): ProjectDataBundle {
  const projet: Projet[] = readTsvFile(basePath, "data/projet.tsv").map((row) => ({
    Projet_ID: row.Projet_ID,
    Nom_Projet: row.Nom_Projet,
    Operation: row.Operation,
    Adresse: row.Adresse,
    Code_Postal: row.Code_Postal,
    Ville: row.Ville,
    Parcelle: row.Parcelle,
    Zone_PLU: row.Zone_PLU,
    Maitre_Ouvrage: row.Maitre_Ouvrage,
    MOE: row.MOE,
    Type_ERP: row.Type_ERP,
    Categorie_ERP: row.Categorie_ERP,
    Surface: row.Surface,
    Date_Debut: row.Date_Debut,
    Date_Fin_Prevue: row.Date_Fin_Prevue,
    Date_Fin_Reelle: row.Date_Fin_Reelle,
    Budget_Prevu_HT: toNumber(row.Budget_Prevu_HT),
    Budget_Prevu_TTC: toNumber(row.Budget_Prevu_TTC),
    Commentaire: row.Commentaire,
  }));

  const phases_mop: PhaseMop[] = readTsvFile(basePath, "data/phases_mop.tsv").map((row) => ({
    Phase_ID: row.Phase_ID,
    Projet_ID: row.Projet_ID,
    Code_Phase: row.Code_Phase,
    Libelle_Phase: row.Libelle_Phase,
    Ordre_Phase: toNumber(row.Ordre_Phase),
    Date_Debut_Prevue: row.Date_Debut_Prevue,
    Date_Fin_Prevue: row.Date_Fin_Prevue,
    Date_Debut_Reelle: row.Date_Debut_Reelle,
    Date_Fin_Reelle: row.Date_Fin_Reelle,
    Statut: row.Statut,
    Responsable: row.Responsable,
    Taux_Avancement: toNumber(row.Taux_Avancement),
    Validation_Client: toYesNo(row.Validation_Client),
    Commentaire: row.Commentaire,
  }));

  const lots: Lot[] = readTsvFile(basePath, "data/lots.tsv").map((row) => ({
    Lot_ID: row.Lot_ID,
    Projet_ID: row.Projet_ID,
    Ensemble: row.Ensemble,
    Code_Lot: row.Code_Lot,
    Numero_Lot: row.Numero_Lot,
    Designation_Lot: row.Designation_Lot,
    Entreprise_ID: row.Entreprise_ID,
    Montant_Marche_HT: toNumber(row.Montant_Marche_HT),
    TVA: toNumber(row.TVA),
    Montant_Marche_TTC: toNumber(row.Montant_Marche_TTC),
    Date_Notification: row.Date_Notification,
    Date_Demarrage: row.Date_Demarrage,
    Date_Reception_Prevue: row.Date_Reception_Prevue,
    Date_Reception_Reelle: row.Date_Reception_Reelle,
    Avancement_Pourcent: toNumber(row.Avancement_Pourcent),
    Statut_Lot: row.Statut_Lot,
    Commentaire: row.Commentaire,
  }));

  const planning: PlanningTask[] = readTsvFile(basePath, "data/planning.tsv").map((row) => ({
    Tache_ID: row.Tache_ID,
    Projet_ID: row.Projet_ID,
    Phase_ID: row.Phase_ID,
    Lot_ID: row.Lot_ID,
    Type_Tache: row.Type_Tache,
    Nom_Tache: row.Nom_Tache,
    Description: row.Description,
    Responsable: row.Responsable,
    Date_Debut_Prevue: row.Date_Debut_Prevue,
    Date_Fin_Prevue: row.Date_Fin_Prevue,
    Duree_Prevue_Jours: toNumber(row.Duree_Prevue_Jours),
    Date_Debut_Reelle: row.Date_Debut_Reelle,
    Date_Fin_Reelle: row.Date_Fin_Reelle,
    Duree_Reelle_Jours: toNumber(row.Duree_Reelle_Jours),
    Avancement_Pourcent: toNumber(row.Avancement_Pourcent),
    Statut_Tache: row.Statut_Tache,
    Priorite: row.Priorite,
    Dependance_Tache_ID: row.Dependance_Tache_ID,
    Jalon: toYesNo(row.Jalon),
    Chemin_Critique: toYesNo(row.Chemin_Critique),
    Retard_Jours: toNumber(row.Retard_Jours),
    Commentaire: row.Commentaire,
  }));

  const intervenants: Intervenant[] = readTsvFile(basePath, "data/intervenants.tsv").map((row) => ({
    Intervenant_ID: row.Intervenant_ID,
    Projet_ID: row.Projet_ID,
    Type_Intervenant: row.Type_Intervenant,
    Raison_Sociale: row.Raison_Sociale,
    Contact: row.Contact,
    Fonction: row.Fonction,
    Email: row.Email,
    Telephone: row.Telephone,
    Adresse: row.Adresse,
    SIRET: row.SIRET,
    Assurance: row.Assurance,
    Lot_ID: row.Lot_ID,
    Actif: toYesNo(row.Actif),
    Commentaire: row.Commentaire,
  }));

  const marches: Marche[] = readTsvFile(basePath, "data/marches.tsv").map((row) => ({
    Marche_ID: row.Marche_ID,
    Projet_ID: row.Projet_ID,
    Lot_ID: row.Lot_ID,
    Entreprise_ID: row.Entreprise_ID,
    Type_Document: row.Type_Document,
    Reference: row.Reference,
    Date_Contrat: row.Date_Contrat,
    Date_Notification: row.Date_Notification,
    Montant_Initial_HT: toNumber(row.Montant_Initial_HT),
    Montant_Avenants_HT: toNumber(row.Montant_Avenants_HT),
    Montant_Actualise_HT: toNumber(row.Montant_Actualise_HT),
    Delai_Execution: row.Delai_Execution,
    Retenue_Garantie: row.Retenue_Garantie,
    Penalites: row.Penalites,
    Commentaire: row.Commentaire,
  }));

  const cctp: ArticleCctp[] = readTsvFile(basePath, "data/cctp.tsv").map((row) => ({
    Article_ID: row.Article_ID,
    Projet_ID: row.Projet_ID,
    Lot_ID: row.Lot_ID,
    Chapitre: row.Chapitre,
    Sous_Chapitre: row.Sous_Chapitre,
    Reference_Article: row.Reference_Article,
    Designation: row.Designation,
    Description: row.Description,
    Unite: row.Unite,
    Observation: row.Observation,
    Actif: toYesNo(row.Actif),
  }));

  const dqe: LigneDqe[] = readTsvFile(basePath, "data/dqe.tsv").map((row) => ({
    Ligne_DQE_ID: row.Ligne_DQE_ID,
    Projet_ID: row.Projet_ID,
    Lot_ID: row.Lot_ID,
    Article_ID: row.Article_ID,
    Reference_Article: row.Reference_Article,
    Designation: row.Designation,
    Unite: row.Unite,
    Quantite_Prevue: toNumber(row.Quantite_Prevue),
    PU_HT: toNumber(row.PU_HT),
    Montant_HT: toNumber(row.Montant_HT),
    TVA: toNumber(row.TVA),
    Montant_TTC: toNumber(row.Montant_TTC),
    Entreprise_ID: row.Entreprise_ID,
    Commentaire: row.Commentaire,
  }));

  const situations: Situation[] = readTsvFile(basePath, "data/situations.tsv").map((row) => ({
    Situation_ID: row.Situation_ID,
    Projet_ID: row.Projet_ID,
    Lot_ID: row.Lot_ID,
    Ligne_DQE_ID: row.Ligne_DQE_ID,
    Periode: row.Periode,
    Date_Situation: row.Date_Situation,
    Quantite_Periode: toNumber(row.Quantite_Periode),
    Quantite_Cumulee: toNumber(row.Quantite_Cumulee),
    Avancement_Pourcent: toNumber(row.Avancement_Pourcent),
    Montant_Periode_HT: toNumber(row.Montant_Periode_HT),
    Montant_Cumule_HT: toNumber(row.Montant_Cumule_HT),
    Reste_A_Facturer_HT: toNumber(row.Reste_A_Facturer_HT),
    Validee: toYesNo(row.Validee),
    Date_Validation: row.Date_Validation,
    Commentaire: row.Commentaire,
  }));

  const chantier_cr: CompteRenduChantier[] = readTsvFile(basePath, "data/chantier_cr.tsv").map((row) => ({
    CR_ID: row.CR_ID,
    Projet_ID: row.Projet_ID,
    Numero_CR: toNumber(row.Numero_CR),
    Date_Reunion: row.Date_Reunion,
    Lieu: row.Lieu,
    Redacteur: row.Redacteur,
    Participants: row.Participants,
    Absents: row.Absents,
    Avancement_Global: toNumber(row.Avancement_Global),
    Points_Bloquants: row.Points_Bloquants,
    Decisions: row.Decisions,
    Date_Prochaine_Reunion: row.Date_Prochaine_Reunion,
    Lien_PDF: row.Lien_PDF,
  }));

  const actions_chantier: ActionChantier[] = readTsvFile(basePath, "data/actions_chantier.tsv").map((row) => ({
    Action_ID: row.Action_ID,
    CR_ID: row.CR_ID,
    Projet_ID: row.Projet_ID,
    Lot_ID: row.Lot_ID,
    Description_Action: row.Description_Action,
    Responsable: row.Responsable,
    Date_Demande: row.Date_Demande,
    Date_Echeance: row.Date_Echeance,
    Statut_Action: row.Statut_Action,
    Priorite: row.Priorite,
    Date_Cloture: row.Date_Cloture,
    Commentaire: row.Commentaire,
  }));

  const facturation_client: FactureClient[] = readTsvFile(basePath, "data/facturation_client.tsv").map((row) => ({
    Facture_ID: row.Facture_ID,
    Projet_ID: row.Projet_ID,
    Client: row.Client,
    Type_Facturation: row.Type_Facturation,
    Phase_ID: row.Phase_ID,
    Reference_Facture: row.Reference_Facture,
    Date_Facture: row.Date_Facture,
    Date_Echeance: row.Date_Echeance,
    Montant_HT: toNumber(row.Montant_HT),
    TVA: toNumber(row.TVA),
    Montant_TTC: toNumber(row.Montant_TTC),
    Montant_Regle: toNumber(row.Montant_Regle),
    Date_Reglement: row.Date_Reglement,
    Reste_Du: toNumber(row.Reste_Du),
    Statut_Facture: row.Statut_Facture,
    Commentaire: row.Commentaire,
  }));

  const suivi_financier: SuiviFinancier[] = readTsvFile(basePath, "data/suivi_financier.tsv").map((row) => ({
    Suivi_ID: row.Suivi_ID,
    Projet_ID: row.Projet_ID,
    Lot_ID: row.Lot_ID,
    Budget_Initial_HT: toNumber(row.Budget_Initial_HT),
    Montant_Marche_HT: toNumber(row.Montant_Marche_HT),
    Montant_Avenants_HT: toNumber(row.Montant_Avenants_HT),
    Montant_Engage_HT: toNumber(row.Montant_Engage_HT),
    Montant_Situations_Validees_HT: toNumber(row.Montant_Situations_Validees_HT),
    Montant_Regle_HT: toNumber(row.Montant_Regle_HT),
    Reste_A_Engager_HT: toNumber(row.Reste_A_Engager_HT),
    Reste_A_Regler_HT: toNumber(row.Reste_A_Regler_HT),
    Ecart_Budget_Marche_HT: toNumber(row.Ecart_Budget_Marche_HT),
    Ecart_Marche_Realise_HT: toNumber(row.Ecart_Marche_Realise_HT),
  }));

  const documents: DocumentProjet[] = readTsvFile(basePath, "data/documents.tsv").map((row) => ({
    Document_ID: row.Document_ID,
    Projet_ID: row.Projet_ID,
    Phase_ID: row.Phase_ID,
    Lot_ID: row.Lot_ID,
    Type_Document: row.Type_Document,
    Reference: row.Reference,
    Version: row.Version,
    Date_Document: row.Date_Document,
    Auteur: row.Auteur,
    Lien_Fichier: row.Lien_Fichier,
    Statut_Validation: row.Statut_Validation,
  }));

  const ccap: ClauseCcap[] = readTsvFile(basePath, "data/ccap.tsv").map((row) => ({
    Clause_ID: row.Clause_ID,
    Projet_ID: row.Projet_ID,
    Lot_ID: row.Lot_ID,
    Chapitre: row.Chapitre,
    Reference_Clause: row.Reference_Clause,
    Designation: row.Designation,
    Description: row.Description,
    Observation: row.Observation,
  }));

  const tableau_de_bord: IndicateurTableauDeBord[] = readTsvFile(basePath, "data/tableau_de_bord.tsv").map((row) => ({
    Indicateur: row.Indicateur,
    Valeur: row.Valeur === "" ? "" : Number.isNaN(Number(row.Valeur)) ? row.Valeur : toNumber(row.Valeur),
    Unite: row.Unite,
    Categorie: row.Categorie,
    Commentaire: row.Commentaire,
  }));

  return {
    projet,
    phases_mop,
    lots,
    planning,
    intervenants,
    marches,
    cctp,
    dqe,
    situations,
    chantier_cr,
    actions_chantier,
    facturation_client,
    suivi_financier,
    documents,
    ccap,
    tableau_de_bord,
  };
}
