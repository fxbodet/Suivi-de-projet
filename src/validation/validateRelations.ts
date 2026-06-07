import { ProjectDataBundle } from "../domain/types";

export interface ValidationIssue {
  scope: string;
  message: string;
  severity: "error" | "warning";
}

function existsInSet(value: string, set: Set<string>): boolean {
  if (!value) {
    return false;
  }
  return set.has(value);
}

export function validateRelations(data: ProjectDataBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const projetIds = new Set(data.projet.map((item) => item.Projet_ID));
  const phaseIds = new Set(data.phases_mop.map((item) => item.Phase_ID));
  const lotIds = new Set(data.lots.map((item) => item.Lot_ID));
  const intervenantIds = new Set(data.intervenants.map((item) => item.Intervenant_ID));
  const articleIds = new Set(data.cctp.map((item) => item.Article_ID));
  const dqeIds = new Set(data.dqe.map((item) => item.Ligne_DQE_ID));
  const crIds = new Set(data.chantier_cr.map((item) => item.CR_ID));

  data.phases_mop.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `phases_mop:${item.Phase_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }
  });

  data.lots.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `lots:${item.Lot_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (item.Entreprise_ID && !existsInSet(item.Entreprise_ID, intervenantIds)) {
      issues.push({
        scope: `lots:${item.Lot_ID}`,
        message: `Entreprise_ID introuvable: ${item.Entreprise_ID}`,
        severity: "warning",
      });
    }
  });

  data.planning.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `planning:${item.Tache_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (item.Phase_ID && !existsInSet(item.Phase_ID, phaseIds)) {
      issues.push({
        scope: `planning:${item.Tache_ID}`,
        message: `Phase_ID introuvable: ${item.Phase_ID}`,
        severity: "error",
      });
    }

    if (item.Lot_ID && !existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `planning:${item.Tache_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "error",
      });
    }
  });

  data.intervenants.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `intervenants:${item.Intervenant_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (item.Lot_ID && !existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `intervenants:${item.Intervenant_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "warning",
      });
    }
  });

  data.marches.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `marches:${item.Marche_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (!existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `marches:${item.Marche_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "error",
      });
    }

    if (item.Entreprise_ID && !existsInSet(item.Entreprise_ID, intervenantIds)) {
      issues.push({
        scope: `marches:${item.Marche_ID}`,
        message: `Entreprise_ID introuvable: ${item.Entreprise_ID}`,
        severity: "warning",
      });
    }
  });

  data.cctp.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `cctp:${item.Article_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (!existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `cctp:${item.Article_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "error",
      });
    }
  });

  data.dqe.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `dqe:${item.Ligne_DQE_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (!existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `dqe:${item.Ligne_DQE_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "error",
      });
    }

    if (item.Article_ID && !existsInSet(item.Article_ID, articleIds)) {
      issues.push({
        scope: `dqe:${item.Ligne_DQE_ID}`,
        message: `Article_ID introuvable: ${item.Article_ID}`,
        severity: "warning",
      });
    }

    if (item.Entreprise_ID && !existsInSet(item.Entreprise_ID, intervenantIds)) {
      issues.push({
        scope: `dqe:${item.Ligne_DQE_ID}`,
        message: `Entreprise_ID introuvable: ${item.Entreprise_ID}`,
        severity: "warning",
      });
    }
  });

  data.situations.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `situations:${item.Situation_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (!existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `situations:${item.Situation_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "error",
      });
    }

    if (!existsInSet(item.Ligne_DQE_ID, dqeIds)) {
      issues.push({
        scope: `situations:${item.Situation_ID}`,
        message: `Ligne_DQE_ID introuvable: ${item.Ligne_DQE_ID}`,
        severity: "error",
      });
    }
  });

  data.chantier_cr.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `chantier_cr:${item.CR_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }
  });

  data.actions_chantier.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `actions_chantier:${item.Action_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (item.CR_ID && !existsInSet(item.CR_ID, crIds)) {
      issues.push({
        scope: `actions_chantier:${item.Action_ID}`,
        message: `CR_ID introuvable: ${item.CR_ID}`,
        severity: "warning",
      });
    }

    if (item.Lot_ID && !existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `actions_chantier:${item.Action_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "warning",
      });
    }
  });

  data.facturation_client.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `facturation_client:${item.Facture_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (item.Phase_ID && !existsInSet(item.Phase_ID, phaseIds)) {
      issues.push({
        scope: `facturation_client:${item.Facture_ID}`,
        message: `Phase_ID introuvable: ${item.Phase_ID}`,
        severity: "warning",
      });
    }
  });

  data.suivi_financier.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `suivi_financier:${item.Suivi_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (!existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `suivi_financier:${item.Suivi_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "error",
      });
    }
  });

  data.documents.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `documents:${item.Document_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (item.Phase_ID && !existsInSet(item.Phase_ID, phaseIds)) {
      issues.push({
        scope: `documents:${item.Document_ID}`,
        message: `Phase_ID introuvable: ${item.Phase_ID}`,
        severity: "warning",
      });
    }

    if (item.Lot_ID && !existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `documents:${item.Document_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "warning",
      });
    }
  });

  data.ccap.forEach((item) => {
    if (!existsInSet(item.Projet_ID, projetIds)) {
      issues.push({
        scope: `ccap:${item.Clause_ID}`,
        message: `Projet_ID introuvable: ${item.Projet_ID}`,
        severity: "error",
      });
    }

    if (item.Lot_ID && !existsInSet(item.Lot_ID, lotIds)) {
      issues.push({
        scope: `ccap:${item.Clause_ID}`,
        message: `Lot_ID introuvable: ${item.Lot_ID}`,
        severity: "warning",
      });
    }
  });

  return issues;
}
