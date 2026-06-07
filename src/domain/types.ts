export type YesNo = "Oui" | "Non";

export interface Projet {
  Projet_ID: string;
  Nom_Projet: string;
  Description: string;
  Adresse: string;
  Ville: string;
  Code_Postal: string;
  Maitre_Ouvrage: string;
  Moe: string;
  Date_Debut: string;
  Date_Fin_Prevue: string;
  Budget_Prevu_HT: number;
  Statut_Projet: string;
  Type_Projet: string;
  ERP: string;
}

export interface PhaseMop {
  Phase_ID: string;
  Projet_ID: string;
  Ordre: number;
  Code_Phase: string;
  Nom_Phase: string;
  Description: string;
  Date_Debut_Prevue: string;
  Date_Fin_Prevue: string;
  Date_Debut_Reelle: string;
  Date_Fin_Reelle: string;
  Statut_Phase: string;
  Livrable_Principal: string;
  Validation_MOA: YesNo;
}

export interface Lot {
  Lot_ID: string;
  Projet_ID: string;
  Ensemble: string;
  Code_Lot: string;
  Numero_Lot: string;
  Designation_Lot: string;
  Entreprise_ID: string;
  Montant_Marche_HT: number;
  TVA: number;
  Montant_Marche_TTC: number;
  Date_Notification: string;
  Date_Demarrage: string;
  Date_Reception_Prevue: string;
  Date_Reception_Reelle: string;
  Avancement_Pourcent: number;
  Statut_Lot: string;
  Commentaire: string;
}

export interface PlanningTask {
  Tache_ID: string;
  Projet_ID: string;
  Phase_ID: string;
  Lot_ID: string;
  Nom_Tache: string;
  Description: string;
  Date_Debut_Prevue: string;
  Date_Fin_Prevue: string;
  Date_Debut_Reelle: string;
  Date_Fin_Reelle: string;
  Duree_Jours: number;
  Statut_Tache: string;
  Priorite: string;
  Dependance: string;
  Jalon: YesNo;
  Responsable: string;
  Commentaire: string;
}

export interface Intervenant {
  Intervenant_ID: string;
  Projet_ID: string;
  Type_Intervenant: string;
  Raison_Sociale: string;
  Contact: string;
  Fonction: string;
  Email: string;
  Telephone: string;
  Adresse: string;
  SIRET: string;
  Assurance: string;
  Lot_ID: string;
  Actif: YesNo;
  Commentaire: string;
}

export interface Marche {
  Marche_ID: string;
  Projet_ID: string;
  Lot_ID: string;
  Entreprise_ID: string;
  Type_Document: string;
  Reference: string;
  Date_Contrat: string;
  Date_Notification: string;
  Montant_Initial_HT: number;
  Montant_Avenants_HT: number;
  Montant_Actualise_HT: number;
  Delai_Execution: string;
  Retenue_Garantie: string;
  Penalites: string;
  Commentaire: string;
}

export interface ArticleCctp {
  Article_ID: string;
  Projet_ID: string;
  Lot_ID: string;
  Chapitre: string;
  Sous_Chapitre: string;
  Reference_Article: string;
  Designation: string;
  Description: string;
  Unite: string;
  Observation: string;
  Actif: YesNo;
}

export interface LigneDqe {
  Ligne_DQE_ID: string;
  Projet_ID: string;
  Lot_ID: string;
  Article_ID: string;
  Reference_Article: string;
  Designation: string;
  Unite: string;
  Quantite_Prevue: number;
  PU_HT: number;
  Montant_HT: number;
  TVA: number;
  Montant_TTC: number;
  Entreprise_ID: string;
  Commentaire: string;
}

export interface Situation {
  Situation_ID: string;
  Projet_ID: string;
  Lot_ID: string;
  Ligne_DQE_ID: string;
  Periode: string;
  Date_Situation: string;
  Quantite_Periode: number;
  Quantite_Cumulee: number;
  Avancement_Pourcent: number;
  Montant_Periode_HT: number;
  Montant_Cumule_HT: number;
  Reste_A_Facturer_HT: number;
  Validee: YesNo;
  Date_Validation: string;
  Commentaire: string;
}

export interface CompteRenduChantier {
  CR_ID: string;
  Projet_ID: string;
  Numero_CR: number;
  Date_Reunion: string;
  Lieu: string;
  Redacteur: string;
  Participants: string;
  Absents: string;
  Avancement_Global: number;
  Points_Bloquants: string;
  Decisions: string;
  Date_Prochaine_Reunion: string;
  Lien_PDF: string;
}

export interface ActionChantier {
  Action_ID: string;
  CR_ID: string;
  Projet_ID: string;
  Lot_ID: string;
  Description_Action: string;
  Responsable: string;
  Date_Demande: string;
  Date_Echeance: string;
  Statut_Action: string;
  Priorite: string;
  Date_Cloture: string;
  Commentaire: string;
}

export interface FactureClient {
  Facture_ID: string;
  Projet_ID: string;
  Client: string;
  Type_Facturation: string;
  Phase_ID: string;
  Reference_Facture: string;
  Date_Facture: string;
  Date_Echeance: string;
  Montant_HT: number;
  TVA: number;
  Montant_TTC: number;
  Montant_Regle: number;
  Date_Reglement: string;
  Reste_Du: number;
  Statut_Facture: string;
  Commentaire: string;
}

export interface SuiviFinancier {
  Suivi_ID: string;
  Projet_ID: string;
  Lot_ID: string;
  Budget_Initial_HT: number;
  Montant_Marche_HT: number;
  Montant_Avenants_HT: number;
  Montant_Engage_HT: number;
  Montant_Situations_Validees_HT: number;
  Montant_Regle_HT: number;
  Reste_A_Engager_HT: number;
  Reste_A_Regler_HT: number;
  Ecart_Budget_Marche_HT: number;
  Ecart_Marche_Realise_HT: number;
}

export interface DocumentProjet {
  Document_ID: string;
  Projet_ID: string;
  Phase_ID: string;
  Lot_ID: string;
  Type_Document: string;
  Reference: string;
  Version: string;
  Date_Document: string;
  Auteur: string;
  Lien_Fichier: string;
  Statut_Validation: string;
}

export interface ClauseCcap {
  Clause_ID: string;
  Projet_ID: string;
  Lot_ID: string;
  Chapitre: string;
  Reference_Clause: string;
  Designation: string;
  Description: string;
  Observation: string;
}

export interface IndicateurTableauDeBord {
  Indicateur: string;
  Valeur: number | string;
  Unite: string;
  Categorie: string;
  Commentaire: string;
}

export interface ProjectDataBundle {
  projet: Projet[];
  phases_mop: PhaseMop[];
  lots: Lot[];
  planning: PlanningTask[];
  intervenants: Intervenant[];
  marches: Marche[];
  cctp: ArticleCctp[];
  dqe: LigneDqe[];
  situations: Situation[];
  chantier_cr: CompteRenduChantier[];
  actions_chantier: ActionChantier[];
  facturation_client: FactureClient[];
  suivi_financier: SuiviFinancier[];
  documents: DocumentProjet[];
  ccap: ClauseCcap[];
  tableau_de_bord: IndicateurTableauDeBord[];
}
