import { ProjectSummary } from "../reporting/projectSummary";
import { ValidationReport } from "../validation";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function renderDashboard(summary: ProjectSummary, validation: ValidationReport): string {
  return [
    "=== Tableau de bord projet ===",
    `Projet                 : ${summary.projectName}`,
    `Statut                 : ${summary.projectStatus}`,
    `Type                   : ${summary.projectType}`,
    `Budget prévu HT        : ${formatCurrency(summary.budgetPrevuHt)}`,
    "",
    "=== Chiffres clés ===",
    `Lots                   : ${summary.lotCount}`,
    `Intervenants           : ${summary.intervenantCount}`,
    `Intervenants actifs    : ${summary.activeIntervenantCount}`,
    `Actions chantier       : ${summary.actionCount}`,
    `Documents              : ${summary.documentCount}`,
    "",
    "=== Finances ===",
    `Total marchés HT       : ${formatCurrency(summary.totalMontantMarcheHt)}`,
    `Total marchés TTC      : ${formatCurrency(summary.totalMontantMarcheTtc)}`,
    `Montant engagé HT      : ${formatCurrency(summary.totalMontantEngageHt)}`,
    `Montant réglé HT       : ${formatCurrency(summary.totalMontantRegleHt)}`,
    `Facturation TTC        : ${formatCurrency(summary.totalFactureTtc)}`,
    `Facturation réglée     : ${formatCurrency(summary.totalFactureReglee)}`,
    "",
    "=== Validation ===",
    `Erreurs                : ${validation.errorCount}`,
    `Warnings               : ${validation.warningCount}`,
    `Projet valide          : ${validation.isValid ? "Oui" : "Non"}`,
  ].join("\n");
}
