import { ProjectDataBundle } from "../domain/types";
import { ValidationIssue } from "./validateRelations";

function isValidDate(value: string): boolean {
  if (!value) {
    return true;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function validatePlanning(data: ProjectDataBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  data.phases_mop.forEach((item) => {
    if (!isValidDate(item.Date_Debut_Prevue) || !isValidDate(item.Date_Fin_Prevue)) {
      issues.push({
        scope: `phases_mop:${item.Phase_ID}`,
        message: `Format de date invalide dans les dates prévues`,
        severity: "error",
      });
    }

    if (!isValidDate(item.Date_Debut_Reelle) || !isValidDate(item.Date_Fin_Reelle)) {
      issues.push({
        scope: `phases_mop:${item.Phase_ID}`,
        message: `Format de date invalide dans les dates réelles`,
        severity: "error",
      });
    }

    if (
      item.Date_Debut_Prevue &&
      item.Date_Fin_Prevue &&
      item.Date_Debut_Prevue > item.Date_Fin_Prevue
    ) {
      issues.push({
        scope: `phases_mop:${item.Phase_ID}`,
        message: `Date_Debut_Prevue postérieure à Date_Fin_Prevue`,
        severity: "error",
      });
    }
  });

  data.planning.forEach((item) => {
    if (!isValidDate(item.Date_Debut_Prevue) || !isValidDate(item.Date_Fin_Prevue)) {
      issues.push({
        scope: `planning:${item.Tache_ID}`,
        message: `Format de date invalide dans les dates prévues`,
        severity: "error",
      });
    }

    if (!isValidDate(item.Date_Debut_Reelle) || !isValidDate(item.Date_Fin_Reelle)) {
      issues.push({
        scope: `planning:${item.Tache_ID}`,
        message: `Format de date invalide dans les dates réelles`,
        severity: "error",
      });
    }

    if (
      item.Date_Debut_Prevue &&
      item.Date_Fin_Prevue &&
      item.Date_Debut_Prevue > item.Date_Fin_Prevue
    ) {
      issues.push({
        scope: `planning:${item.Tache_ID}`,
        message: `Date_Debut_Prevue postérieure à Date_Fin_Prevue`,
        severity: "error",
      });
    }

    if (
      item.Date_Debut_Reelle &&
      item.Date_Fin_Reelle &&
      item.Date_Debut_Reelle > item.Date_Fin_Reelle
    ) {
      issues.push({
        scope: `planning:${item.Tache_ID}`,
        message: `Date_Debut_Reelle postérieure à Date_Fin_Reelle`,
        severity: "error",
      });
    }

    if (item.Duree_Prevue_Jours < 0) {
      issues.push({
        scope: `planning:${item.Tache_ID}`,
        message: `Duree_Prevue_Jours négative`,
        severity: "error",
      });
    }
  });

  data.chantier_cr.forEach((item) => {
    if (!isValidDate(item.Date_Reunion) || !isValidDate(item.Date_Prochaine_Reunion)) {
      issues.push({
        scope: `chantier_cr:${item.CR_ID}`,
        message: `Format de date invalide`,
        severity: "error",
      });
    }

    if (item.Avancement_Global < 0 || item.Avancement_Global > 100) {
      issues.push({
        scope: `chantier_cr:${item.CR_ID}`,
        message: `Avancement_Global hors bornes: ${item.Avancement_Global}`,
        severity: "error",
      });
    }
  });

  data.actions_chantier.forEach((item) => {
    if (!isValidDate(item.Date_Demande) || !isValidDate(item.Date_Echeance) || !isValidDate(item.Date_Cloture)) {
      issues.push({
        scope: `actions_chantier:${item.Action_ID}`,
        message: `Format de date invalide`,
        severity: "error",
      });
    }

    if (item.Date_Demande && item.Date_Echeance && item.Date_Demande > item.Date_Echeance) {
      issues.push({
        scope: `actions_chantier:${item.Action_ID}`,
        message: `Date_Demande postérieure à Date_Echeance`,
        severity: "warning",
      });
    }
  });

  return issues;
}
