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
            <td>${lot.Nom_Lot}</td>
            <td>${lot.Entreprise_Attributaire}</td>
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
      </div>`;

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
      .nav {
        margin-bottom: 20px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .nav a, .quick-links a {
        text-decoration: none;
        color: white;
        background: #2563eb;
        padding: 10px 14px;
        border-radius: 8px;
        display: inline-block;
      }
      .quick-links {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 12px;
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
        font-size: 1.05rem;
        margin: 8px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
      }
      th, td {
        border-bottom: 1px solid #ddd;
        text-align: left;
        padding: 10px;
      }
      th {
        background: #f1f5f9;
      }
      ul {
        padding-left: 20px;
      }
      .badge-ok {
        color: #166534;
        font-weight: bold;
      }
      .badge-ko {
        color: #991b1b;
        font-weight: bold;
      }
    </style>
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
    </nav>

    <div class="card">
      <h2>Projet</h2>
      <div class="metric"><strong>Nom :</strong> ${summary.projectName}</div>
      <div class="metric"><strong>Statut :</strong> ${summary.projectStatus}</div>
      <div class="metric"><strong>Type :</strong> ${summary.projectType}</div>
      <div class="metric"><strong>Budget prévu HT :</strong> ${formatCurrency(summary.budgetPrevuHt)}</div>
      <div class="metric"><strong>Projet valide :</strong> <span class="${validation.isValid ? "badge-ok" : "badge-ko"}">${validation.isValid ? "Oui" : "Non"}</span></div>
      ${quickLinks}
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
      <table>
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
      <ul>${issuesRows || "<li>Aucune alerte.</li>"}</ul>
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
