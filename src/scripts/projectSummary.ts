import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { buildProjectSummary } from "../reporting/projectSummary";
import { validateProjectData } from "../validation";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function main() {
  const basePath = path.resolve(process.cwd());

  console.log(`Chargement des données depuis : ${basePath}`);

  try {
    const data = loadProjectData(basePath);
    const summary = buildProjectSummary(data);
    const validation = validateProjectData(data);

    console.log("");
    console.log("=== Synthèse projet ===");
    console.log(`Nom du projet         : ${summary.projectName}`);
    console.log(`Statut                : ${summary.projectStatus}`);
    console.log(`Type                  : ${summary.projectType}`);
    console.log(`Budget prévu HT       : ${formatCurrency(summary.budgetPrevuHt)}`);
    console.log("");

    console.log("=== Volumétrie ===");
    console.log(`Projets               : ${summary.projectCount}`);
    console.log(`Phases                : ${summary.phaseCount}`);
    console.log(`Lots                  : ${summary.lotCount}`);
    console.log(`Intervenants          : ${summary.intervenantCount}`);
    console.log(`Intervenants actifs   : ${summary.activeIntervenantCount}`);
    console.log(`Marchés               : ${summary.marcheCount}`);
    console.log(`Lignes DQE            : ${summary.dqeCount}`);
    console.log(`Situations            : ${summary.situationCount}`);
    console.log(`CR chantier           : ${summary.chantierCrCount}`);
    console.log(`Actions chantier      : ${summary.actionCount}`);
    console.log(`Factures client       : ${summary.factureCount}`);
    console.log(`Documents             : ${summary.documentCount}`);
    console.log("");

    console.log("=== Indicateurs financiers ===");
    console.log(`Total marchés HT      : ${formatCurrency(summary.totalMontantMarcheHt)}`);
    console.log(`Total marchés TTC     : ${formatCurrency(summary.totalMontantMarcheTtc)}`);
    console.log(`Budget initial HT     : ${formatCurrency(summary.totalBudgetInitialHt)}`);
    console.log(`Montant engagé HT     : ${formatCurrency(summary.totalMontantEngageHt)}`);
    console.log(`Montant réglé HT      : ${formatCurrency(summary.totalMontantRegleHt)}`);
    console.log(`Facturation TTC       : ${formatCurrency(summary.totalFactureTtc)}`);
    console.log(`Facturation réglée    : ${formatCurrency(summary.totalFactureReglee)}`);
    console.log("");

    console.log("=== Validation ===");
    console.log(`Erreurs               : ${validation.errorCount}`);
    console.log(`Warnings              : ${validation.warningCount}`);
    console.log(`Projet valide         : ${validation.isValid ? "Oui" : "Non"}`);
  } catch (error) {
    console.error("Erreur lors de la génération de la synthèse projet.");
    console.error(error);
    process.exit(1);
  }
}

main();
