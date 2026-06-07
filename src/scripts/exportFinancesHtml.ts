import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { buildProjectSummary } from "../reporting/projectSummary";

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
  const outputFile = path.join(outputDir, "finances.html");

  try {
    const data = loadProjectData(basePath);
    const summary = buildProjectSummary(data);

    const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Finances projet</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>Finances projet</h1>

    <nav class="nav">
      <a href="./dashboard.html">Dashboard</a>
      <a href="./lots.html">Lots</a>
      <a href="./validation.html">Validation</a>
      <a href="./intervenants.html">Intervenants</a>
      <a href="./actions.html">Actions</a>
      <a href="./documents.html">Documents</a>
      <a href="./finances.html">Finances</a>
    </nav>

    <div class="card">
      <h2>Synthèse financière</h2>
      <div class="grid">
        <div class="kpi">
          <div class="kpi-title">Budget prévu HT</div>
          <div class="kpi-value">${formatCurrency(summary.budgetPrevuHt)}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Total marchés HT</div>
          <div class="kpi-value">${formatCurrency(summary.totalMontantMarcheHt)}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Total marchés TTC</div>
          <div class="kpi-value">${formatCurrency(summary.totalMontantMarcheTtc)}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Montant engagé HT</div>
          <div class="kpi-value">${formatCurrency(summary.totalMontantEngageHt)}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Montant réglé HT</div>
          <div class="kpi-value">${formatCurrency(summary.totalMontantRegleHt)}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Facturation TTC</div>
          <div class="kpi-value">${formatCurrency(summary.totalFactureTtc)}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Facturation réglée</div>
          <div class="kpi-value">${formatCurrency(summary.totalFactureReglee)}</div>
        </div>
      </div>
    </div>
  </body>
</html>`;

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export HTML des finances.");
    console.error(error);
    process.exit(1);
  }
}

main();
