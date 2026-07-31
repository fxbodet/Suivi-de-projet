import { ProjectDataBundle, ValidationIssue } from "../domain/types";

function findDuplicates(values: string[]): string[] {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    if (!value) {
      return;
    }
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

export function validateDuplicates(data: ProjectDataBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const duplicateConfigs = [
    { scope: "projet", field: "Projet_ID", values: data.projet.map((x) => x.Projet_ID) },
    { scope: "phases_mop", field: "Phase_ID", values: data.phases_mop.map((x) => x.Phase_ID) },
    { scope: "lots", field: "Lot_ID", values: data.lots.map((x) => x.Lot_ID) },
    { scope: "planning", field: "Tache_ID", values: data.planning.map((x) => x.Tache_ID) },
    { scope: "intervenants", field: "Intervenant_ID", values: data.intervenants.map((x) => x.Intervenant_ID) },
    { scope: "marches", field: "Marche_ID", values: data.marches.map((x) => x.Marche_ID) },
    { scope: "cctp", field: "Article_ID", values: data.cctp.map((x) => x.Article_ID) },
    { scope: "dqe", field: "Ligne_DQE_ID", values: data.dqe.map((x) => x.Ligne_DQE_ID) },
    { scope: "situations", field: "Situation_ID", values: data.situations.map((x) => x.Situation_ID) },
    { scope: "chantier_cr", field: "CR_ID", values: data.chantier_cr.map((x) => x.CR_ID) },
    { scope: "actions_chantier", field: "Action_ID", values: data.actions_chantier.map((x) => x.Action_ID) },
    { scope: "facturation_client", field: "Facture_ID", values: data.facturation_client.map((x) => x.Facture_ID) },
    { scope: "suivi_financier", field: "Suivi_ID", values: data.suivi_financier.map((x) => x.Suivi_ID) },
    { scope: "documents", field: "Document_ID", values: data.documents.map((x) => x.Document_ID) },
    { scope: "ccap", field: "Clause_ID", values: data.ccap.map((x) => x.Clause_ID) },
    { scope: "tableau_de_bord", field: "Indicateur", values: data.tableau_de_bord.map((x) => x.Indicateur) },
  ];

  duplicateConfigs.forEach(({ scope, field, values }) => {
    const duplicates = findDuplicates(values);
    duplicates.forEach((duplicateValue) => {
      issues.push({
        scope,
        message: `${field} dupliqué: ${duplicateValue}`,
        severity: "error",
      });
    });
  });

  return issues;
}
