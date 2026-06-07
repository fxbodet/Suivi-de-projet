import { ProjectDataBundle } from "../domain/types";
import { ValidationIssue } from "./validateRelations";

function checkAllowedValue(
  issues: ValidationIssue[],
  scope: string,
  field: string,
  value: string,
  allowed: string[],
  severity: "error" | "warning" = "warning"
) {
  if (!value) {
    return;
  }

  if (!allowed.includes(value)) {
    issues.push({
      scope,
      message: `${field} invalide: ${value}. Valeurs autorisées: ${allowed.join(", ")}`,
      severity,
    });
  }
}

export function validateEnums(data: ProjectDataBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const projetStatuses = ["PREVU", "EN_COURS", "TERMINE", "SUSPENDU"];
  const taskStatuses = ["PREVU", "EN_COURS", "BLOQUE", "TERMINE", "ANNULE"];
  const priorities = ["BASSE", "MOYENNE", "HAUTE", "CRITIQUE"];
  const yesNo = ["Oui", "Non"];
  const factureStatuses = ["PREVU", "EMISE", "PARTIELLEMENT_REGLEE", "REGLEE", "EN_RETARD"];
  const documentTypes = ["NOTE", "CCTP", "CCAP", "DQE", "CR", "OS", "AVENANT", "FACTURE", "PV_RECEPTION"];
  const intervenantTypes = ["MAITRE_OUVRAGE", "MOE", "ENTREPRISE", "BET", "BUREAU_CONTROLE", "SPS", "FOURNISSEUR"];

  data.projet.forEach((item) => {
    checkAllowedValue(issues, `projet:${item.Projet_ID}`, "Statut_Projet", item.Statut_Projet, projetStatuses, "error");
  });

  data.phases_mop.forEach((item) => {
    checkAllowedValue(issues, `phases_mop:${item.Phase_ID}`, "Validation_MOA", item.Validation_MOA, yesNo, "error");
  });

  data.planning.forEach((item) => {
    checkAllowedValue(issues, `planning:${item.Tache_ID}`, "Statut_Tache", item.Statut_Tache, taskStatuses, "warning");
    checkAllowedValue(issues, `planning:${item.Tache_ID}`, "Priorite", item.Priorite, priorities, "warning");
    checkAllowedValue(issues, `planning:${item.Tache_ID}`, "Jalon", item.Jalon, yesNo, "error");
  });

  data.intervenants.forEach((item) => {
    checkAllowedValue(issues, `intervenants:${item.Intervenant_ID}`, "Type_Intervenant", item.Type_Intervenant, intervenantTypes, "warning");
    checkAllowedValue(issues, `intervenants:${item.Intervenant_ID}`, "Actif", item.Actif, yesNo, "error");
  });

  data.cctp.forEach((item) => {
    checkAllowedValue(issues, `cctp:${item.Article_ID}`, "Actif", item.Actif, yesNo, "error");
  });

  data.situations.forEach((item) => {
    checkAllowedValue(issues, `situations:${item.Situation_ID}`, "Validee", item.Validee, yesNo, "error");
  });

  data.actions_chantier.forEach((item) => {
    checkAllowedValue(issues, `actions_chantier:${item.Action_ID}`, "Statut_Action", item.Statut_Action, taskStatuses, "warning");
    checkAllowedValue(issues, `actions_chantier:${item.Action_ID}`, "Priorite", item.Priorite, priorities, "warning");
  });

  data.facturation_client.forEach((item) => {
    checkAllowedValue(issues, `facturation_client:${item.Facture_ID}`, "Statut_Facture", item.Statut_Facture, factureStatuses, "warning");
  });

  data.documents.forEach((item) => {
    checkAllowedValue(issues, `documents:${item.Document_ID}`, "Type_Document", item.Type_Document, documentTypes, "warning");
  });

  return issues;
}
