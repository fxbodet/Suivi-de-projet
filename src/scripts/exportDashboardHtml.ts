import fs from "node:fs";
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
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "dashboard.html");

  try {
    const data = loadProjectData(basePath);
    const summary = buildProjectSummary(data);
    const validation = validateProjectData(data);

    const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tableau de bord projet</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 32px;
        background: #f7f7f7;
        color: #222;
      }
      h1, h2 {
        color: #0f172a;
      }
      .card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
      .metric {
        font-size: 1.1rem;
        margin: 8px 0;
      }
    </style>
  </head>
  <body>
    <h1>Tableau de bord projet</h1>

    <div class="card">
      <h2>Projet</h2>
      <div class="metric"><strong>Nom :</strong> ${summary.projectName}</div>
      <div class="metric"><strong>Statut :</strong> ${summary.projectStatus}</div>
      <div class="metric"><strong>Type :</strong> ${summary.projectType}</div>
      <div class="metric"><strong>Budget prévu HT :</strong> ${formatCurrency(summary.budgetPrevuHt)}</div>
    </div>

    <div class="card">
      <h2>Chiffres clés</h2>
      <div class="grid">
        <div class="metric"><strong>Lots :</strong> ${summary.lotCount}</div>
        <div class="metric"><strong>Intervenants :</strong> ${summary.intervenantCount}</div>
        <div class="metric"><strong>Intervenants actifs :</strong> ${summary.activeIntervenantCount}</div>
        <div class="metric"><strong>Actions chantier :</strong> ${summary.actionCount}</div>
        <div class="metric"><strong>Documents :</strong> ${summary.documentCount}</div>
      </div>
    </div>

    <div class="card">
      <h2>Finances</h2>
      <div class="grid">
        <div class="metric"><strong>Total marchés HT :</strong> ${formatCurrency(summary.totalMontantMarcheHt)}</div>
        <div class="metric"><strong>Total marchés TTC :</strong> ${formatCurrency(summary.totalMontantMarcheTtc)}</div>
        <div class="metric"><strong>Montant engagé HT :</strong> ${formatCurrency(summary.totalMontantEngageHt)}</div>
        <div class="metric"><strong>Montant réglé HT :</strong> ${formatCurrency(summary.totalMontantRegleHt)}</div>
        <div class="metric"><strong>Facturation TTC :</strong> ${formatCurrency(summary.totalFactureTtc)}</div>
        <div class="metric"><strong>Facturation réglée :</strong> ${formatCurrency(summary.totalFactureReglee)}</div>
      </div>
    </div>

    <div class="card">
      <h2>Validation</h2>
      <div class="metric"><strong>Erreurs :</strong> ${validation.errorCount}</div>
      <div class="metric"><strong>Warnings :</strong> ${validation.warningCount}</div>
      <div class="metric"><strong>Projet valide :</strong> ${validation.isValid ? "Oui" : "Non"}</div>
    </div>
  </body>
</html>`;

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export du tableau de bord HTML.");
    console.error(error);
    process.exit(1);
  }
}

main();
