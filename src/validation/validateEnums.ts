import { ProjectDataBundle, ValidationIssue } from "../domain/types";
import parametres from "../../config/parametres.json" with { type: "json" };

const taskStatuses = parametres.statuts;
const priorities = parametres.priorites;
const phasesMop = parametres.phasesMop;
const typesTachePlanning = parametres.typesTachePlanning;
const tvaAllowed = parametres.tva.map(String);
const yesNo = ["Oui", "Non"];
const factureStatuses = ["PREVU", "EMISE", "PARTIELLEMENT_REGLEE", "REGLEE", "EN_RETARD"];
const documentTypes = ["NOTE", "CCTP", "CCAP", "DQE", "CR", "OS", "AVENANT", "FACTURE", "PV_RECEPTION"];
const intervenantTypes = ["MAITRE_OUVRAGE", "MOE", "ENTREPRISE", "BET", "BUREAU_CONTROLE", "SPS", "FOURNISSEUR"];

const taskStatusesSet = new Set(taskStatuses);
const prioritiesSet = new Set(priorities);
const phasesMopSet = new Set(phasesMop);
const typesTacheSet = new Set(typesTachePlanning);
const tvaAllowedSet = new Set(tvaAllowed);
const yesNoSet = new Set(yesNo);
const factureStatusesSet = new Set(factureStatuses);
const documentTypesSet = new Set(documentTypes);
const intervenantTypesSet = new Set(intervenantTypes);

function checkAllowedValue(
  issues: ValidationIssue[],
  scope: string,
  field: string,
  value: string,
  allowed: Set<string>,
  allowedList: string[],
  severity: "error" | "warning" = "warning"
) {
  if (!value) {
    return;
  }

  if (!allowed.has(value)) {
    issues.push({
      scope,
      message: `${field} invalide: ${value}. Valeurs autorisées: ${allowedList.join(", ")}`,
      severity,
    });
  }
}

export function validateEnums(data: ProjectDataBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  data.phases_mop.forEach((item) => {
    checkAllowedValue(issues, `phases_mop:${item.Phase_ID}`, "Code_Phase", item.Code_Phase, phasesMopSet, phasesMop, "warning");
    checkAllowedValue(issues, `phases_mop:${item.Phase_ID}`, "Validation_Client", item.Validation_Client, yesNoSet, yesNo, "error");
  });

  data.planning.forEach((item) => {
    checkAllowedValue(issues, `planning:${item.Tache_ID}`, "Type_Tache", item.Type_Tache, typesTacheSet, typesTachePlanning, "warning");
    checkAllowedValue(issues, `planning:${item.Tache_ID}`, "Statut_Tache", item.Statut_Tache, taskStatusesSet, taskStatuses, "warning");
    checkAllowedValue(issues, `planning:${item.Tache_ID}`, "Priorite", item.Priorite, prioritiesSet, priorities, "warning");
    checkAllowedValue(issues, `planning:${item.Tache_ID}`, "Jalon", item.Jalon, yesNoSet, yesNo, "error");
  });

  data.lots.forEach((item) => {
    if (item.TVA !== 0 && !tvaAllowedSet.has(String(item.TVA))) {
      issues.push({
        scope: `lots:${item.Lot_ID}`,
        message: `TVA invalide: ${item.TVA}. Valeurs autorisées: ${tvaAllowed.join(", ")}`,
        severity: "warning",
      });
    }
  });

  data.dqe.forEach((item) => {
    if (item.TVA !== 0 && !tvaAllowedSet.has(String(item.TVA))) {
      issues.push({
        scope: `dqe:${item.Ligne_DQE_ID}`,
        message: `TVA invalide: ${item.TVA}. Valeurs autorisées: ${tvaAllowed.join(", ")}`,
        severity: "warning",
      });
    }
  });

  data.facturation_client.forEach((item) => {
    if (item.TVA !== 0 && !tvaAllowedSet.has(String(item.TVA))) {
      issues.push({
        scope: `facturation_client:${item.Facture_ID}`,
        message: `TVA invalide: ${item.TVA}. Valeurs autorisées: ${tvaAllowed.join(", ")}`,
        severity: "warning",
      });
    }
    checkAllowedValue(issues, `facturation_client:${item.Facture_ID}`, "Statut_Facture", item.Statut_Facture, factureStatusesSet, factureStatuses, "warning");
  });

  data.intervenants.forEach((item) => {
    checkAllowedValue(issues, `intervenants:${item.Intervenant_ID}`, "Type_Intervenant", item.Type_Intervenant, intervenantTypesSet, intervenantTypes, "warning");
    checkAllowedValue(issues, `intervenants:${item.Intervenant_ID}`, "Actif", item.Actif, yesNoSet, yesNo, "error");
  });

  data.cctp.forEach((item) => {
    checkAllowedValue(issues, `cctp:${item.Article_ID}`, "Actif", item.Actif, yesNoSet, yesNo, "error");
  });

  data.situations.forEach((item) => {
    checkAllowedValue(issues, `situations:${item.Situation_ID}`, "Validee", item.Validee, yesNoSet, yesNo, "error");
  });

  data.actions_chantier.forEach((item) => {
    checkAllowedValue(issues, `actions_chantier:${item.Action_ID}`, "Statut_Action", item.Statut_Action, taskStatusesSet, taskStatuses, "warning");
    checkAllowedValue(issues, `actions_chantier:${item.Action_ID}`, "Priorite", item.Priorite, prioritiesSet, priorities, "warning");
  });

  data.documents.forEach((item) => {
    checkAllowedValue(issues, `documents:${item.Document_ID}`, "Type_Document", item.Type_Document, documentTypesSet, documentTypes, "warning");
  });

  return issues;
}
