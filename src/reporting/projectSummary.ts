import { ProjectDataBundle } from "../domain/types";

export interface ProjectSummary {
  projectName: string;
  projectOperation: string;
  budgetPrevuHt: number;
  projectCount: number;
  phaseCount: number;
  lotCount: number;
  intervenantCount: number;
  marcheCount: number;
  dqeCount: number;
  situationCount: number;
  chantierCrCount: number;
  actionCount: number;
  factureCount: number;
  documentCount: number;
  totalMontantMarcheHt: number;
  totalMontantMarcheTtc: number;
  totalBudgetInitialHt: number;
  totalMontantEngageHt: number;
  totalMontantRegleHt: number;
  totalFactureTtc: number;
  totalFactureReglee: number;
  activeIntervenantCount: number;
}

function sum(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

export function buildProjectSummary(data: ProjectDataBundle): ProjectSummary {
  const mainProject = data.projet[0];

  return {
    projectName: mainProject?.Nom_Projet ?? "",
    projectOperation: mainProject?.Operation ?? "",
    budgetPrevuHt: mainProject?.Budget_Prevu_HT ?? 0,
    projectCount: data.projet.length,
    phaseCount: data.phases_mop.length,
    lotCount: data.lots.length,
    intervenantCount: data.intervenants.length,
    marcheCount: data.marches.length,
    dqeCount: data.dqe.length,
    situationCount: data.situations.length,
    chantierCrCount: data.chantier_cr.length,
    actionCount: data.actions_chantier.length,
    factureCount: data.facturation_client.length,
    documentCount: data.documents.length,
    totalMontantMarcheHt: sum(data.lots.map((item) => item.Montant_Marche_HT)),
    totalMontantMarcheTtc: sum(data.lots.map((item) => item.Montant_Marche_TTC)),
    totalBudgetInitialHt: sum(data.suivi_financier.map((item) => item.Budget_Initial_HT)),
    totalMontantEngageHt: sum(data.suivi_financier.map((item) => item.Montant_Engage_HT)),
    totalMontantRegleHt: sum(data.suivi_financier.map((item) => item.Montant_Regle_HT)),
    totalFactureTtc: sum(data.facturation_client.map((item) => item.Montant_TTC)),
    totalFactureReglee: sum(data.facturation_client.map((item) => item.Montant_Regle)),
    activeIntervenantCount: data.intervenants.filter((item) => item.Actif === "Oui").length,
  };
}
