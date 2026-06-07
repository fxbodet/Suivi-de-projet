import { ProjectSummary } from "../reporting/projectSummary";
import { ValidationReport } from "../validation";
import { divider, formatCurrency, section } from "./formatters";

export function renderDashboard(summary: ProjectSummary, validation: ValidationReport): string {
  return [
    divider(72, "="),
    "TABLEAU DE BORD PROJET",
    divider(72, "="),
    ...section("Projet"),
    `Projet                 : ${summary.projectName}`,
    `Statut                 : ${summary.projectStatus}`,
    `Type                   : ${summary.projectType}`,
    `Budget prévu HT        : ${formatCurrency(summary.budgetPrevuHt)}`,
    ...section("Chiffres clés"),
    `Lots                   : ${summary.lotCount}`,
    `Intervenants           : ${summary.intervenantCount}`,
    `Intervenants actifs    : ${summary.activeIntervenantCount}`,
    `Actions chantier       : ${summary.actionCount}`,
    `Documents              : ${summary.documentCount}`,
    ...section("Finances"),
    `Total marchés HT       : ${formatCurrency(summary.totalMontantMarcheHt)}`,
    `Total marchés TTC      : ${formatCurrency(summary.totalMontantMarcheTtc)}`,
    `Montant engagé HT      : ${formatCurrency(summary.totalMontantEngageHt)}`,
    `Montant réglé HT       : ${formatCurrency(summary.totalMontantRegleHt)}`,
    `Facturation TTC        : ${formatCurrency(summary.totalFactureTtc)}`,
    `Facturation réglée     : ${formatCurrency(summary.totalFactureReglee)}`,
    ...section("Validation"),
    `Erreurs                : ${validation.errorCount}`,
    `Warnings               : ${validation.warningCount}`,
    `Projet valide          : ${validation.isValid ? "Oui" : "Non"}`,
    "",
    divider(72, "="),
  ].join("\n");
}
