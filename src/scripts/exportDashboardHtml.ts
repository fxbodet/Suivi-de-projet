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
    const topIssues = validation.issues.slice(0, 10);

    const lotsRows = data.lots
      .map(
        (lot) => `
          <tr>
            <td>${lot.Lot_ID}</td>
            <td>${lot.Designation_Lot}</td>
            <td>${lot.Entreprise_ID}</td>
            <td>${lot.Statut_Lot}</td>
            <td>${lot.Avancement_Pourcent}%</td>
            <td>${formatCurrency(lot.Montant_Marche_HT)}</td>
          </tr>`
      )
      .join("");

    const issuesRows = topIssues
      .map(
        (issue) => `
          <li><strong>${issue.severity}</strong> [${issue.scope}] — ${issue.message}</li>`
      )
      .join("");

    const quickLinks = `
      <div class="quick-links">
        <a href="./lots.html">Voir les lots</a>
        <a href="./validation.html">Voir la validation</a>
        <a href="./intervenants.html">Voir les intervenants</a>
        <a href="./actions.html">Voir les actions</a>
        <a href="./documents.html">Voir les documents</a>
        <a href="./finances.html">Voir les finances</a>
      </div>`;

    const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tableau de bord projet</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>Tableau de bord projet</h1>

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
      <h2>Projet</h2>
      <div class="metric"><strong>Nom :</strong> ${summary.projectName}</div>
      <div class="metric"><strong>Opération :</strong> ${summary.projectOperation}</div>
      <div class="metric"><strong>Budget prévu HT :</strong> ${formatCurrency(summary.budgetPrevuHt)}</div>
      <div class="metric"><strong>Projet valide :</strong> <span class="${validation.isValid ? "badge-ok" : "badge-ko"}">${validation.isValid ? "Oui" : "Non"}</span></div>
      ${quickLinks}
    </div>

    <div class="card">
      <h2>Indicateurs visuels</h2>
      <div class="grid">
        <div class="kpi">
          <div class="kpi-title">Lots</div>
          <div class="kpi-value">${summary.lotCount}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Actions chantier</div>
          <div class="kpi-value">${summary.actionCount}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Documents</div>
          <div class="kpi-value">${summary.documentCount}</div>
        </div>
        <div class="kpi">
          <div class="kpi-title">Erreurs</div>
          <div class="kpi-value">${validation.errorCount}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Chiffres clés</h2>
      <div class="grid">
        <div class="metric"><strong>Lots :</strong> ${summary.lotCount}</div>
        <div class="metric"><strong>Intervenants :</strong> ${summary.intervenantCount}</div>
        <div class="metric"><strong>Intervenants actifs :</strong> ${summary.activeIntervenantCount}</div>
        <div class="metric"><strong>Actions chantier :</strong> ${summary.actionCount}</div>
        <div class="metric"><strong>Documents :</strong> ${summary.documentCount}</div>
        <div class="metric"><strong>Erreurs :</strong> ${validation.errorCount}</div>
        <div class="metric"><strong>Warnings :</strong> ${validation.warningCount}</div>
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
      <h2>Lots</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Lot_ID</th>
            <th>Nom lot</th>
            <th>Entreprise</th>
            <th>Statut</th>
            <th>Avancement</th>
            <th>Montant HT</th>
          </tr>
        </thead>
        <tbody>${lotsRows}</tbody>
      </table>
    </div>

    <div class="card">
      <h2>Top alertes</h2>
      <ul class="list">${issuesRows || "<li>Aucune alerte.</li>"}</ul>
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
