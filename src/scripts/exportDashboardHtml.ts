import fs from "node:fs";
import path from "node:path";

import { buildDashboardViewData } from "../services/dashboardService";
import { getProjectContext } from "../services/projectService";
import { renderPageLayout } from "../ui/layout";
import { renderDashboardNavigation } from "../ui/navigation";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function main() {
  try {
    const { basePath, data, summary, validation } = getProjectContext();
    const outputDir = path.join(basePath, "output");
    const outputFile = path.join(outputDir, "dashboard.html");
    const dashboard = buildDashboardViewData({ data, summary, validation });

    const lotsRows = dashboard.lots
      .map(
        (lot) => `
          <tr>
            <td>${lot.lotId}</td>
            <td>${lot.designation}</td>
            <td>${lot.entrepriseId}</td>
            <td>${lot.statut}</td>
            <td>${lot.avancementPourcent}%</td>
            <td>${formatCurrency(lot.montantMarcheHt)}</td>
          </tr>`
      )
      .join("");

    const issuesRows = dashboard.topIssues
      .map(
        (issue) => `
          <li><strong>${issue.severity}</strong> [${issue.scope}] — ${issue.message}</li>`
      )
      .join("");

    const quickLinks = `
      <div class="quick-links">
        ${dashboard.quickLinks.map((link) => `<a href="${link.href}">${link.label}</a>`).join("\n        ")}
      </div>`;

    const visualKpis = dashboard.visualKpis
      .map(
        (kpi) => `
        <div class="kpi">
          <div class="kpi-title">${kpi.title}</div>
          <div class="kpi-value">${kpi.value}</div>
        </div>`
      )
      .join("");

    const content = `<div class="card">
      <h2>Projet</h2>
      <div class="metric"><strong>Nom :</strong> ${summary.projectName}</div>
      <div class="metric"><strong>Opération :</strong> ${summary.projectOperation}</div>
      <div class="metric"><strong>Budget prévu HT :</strong> ${formatCurrency(summary.budgetPrevuHt)}</div>
      <div class="metric"><strong>Projet valide :</strong> <span class="${validation.isValid ? "badge-ok" : "badge-ko"}">${validation.isValid ? "Oui" : "Non"}</span></div>
      ${quickLinks}
    </div>

    <div class="card">
      <h2>Indicateurs visuels</h2>
      <div class="grid">${visualKpis}
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
    </div>`;

    const html = renderPageLayout({
      title: "Tableau de bord projet",
      navigation: renderDashboardNavigation("dashboard"),
      content,
    });

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
