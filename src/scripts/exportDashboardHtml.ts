import fs from "node:fs";
import path from "node:path";

import { buildDashboardViewModel } from "../services/dashboardService";
import { getProjectContext } from "../services/projectService";
import {
  renderBadge,
  renderCard,
  renderKeyValueList,
  renderLink,
  renderTable,
} from "../ui/components";
import { formatCurrency } from "../ui/formatters";
import { renderPageLayout } from "../ui/layout";
import { renderDashboardNavigation } from "../ui/navigation";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "dashboard.html");

  try {
    const { data, summary, validation } = getProjectContext(basePath);
    const viewModel = buildDashboardViewModel({ data, summary, validation });

    const projectCard = renderCard(
      "Projet",
      `
        ${renderKeyValueList([
          { label: "Nom", value: viewModel.projectName },
          { label: "Opération", value: viewModel.projectOperation },
          { label: "Budget prévu HT", value: formatCurrency(viewModel.budgetPrevuHt) },
        ])}
        <div class="metric"><strong>Projet valide :</strong> ${renderBadge(
          viewModel.isValid ? "Oui" : "Non",
          viewModel.isValid ? "ok" : "ko"
        )}</div>
        <div class="quick-links">
          ${viewModel.quickLinks
            .map((link) =>
              renderLink(link.href, {
                label: link.label,
              })
            )
            .join("")}
        </div>
      `
    );

    const kpiCard = renderCard(
      "Indicateurs visuels",
      `
        <div class="grid">
          <div class="kpi">
            <div class="kpi-title">Lots</div>
            <div class="kpi-value">${viewModel.lotCount}</div>
          </div>
          <div class="kpi">
            <div class="kpi-title">Actions chantier</div>
            <div class="kpi-value">${viewModel.actionCount}</div>
          </div>
          <div class="kpi">
            <div class="kpi-title">Documents</div>
            <div class="kpi-value">${viewModel.documentCount}</div>
          </div>
          <div class="kpi">
            <div class="kpi-title">Erreurs</div>
            <div class="kpi-value">${viewModel.errorCount}</div>
          </div>
        </div>
      `
    );

    const summaryCard = renderCard(
      "Chiffres clés",
      renderKeyValueList([
        { label: "Lots", value: viewModel.lotCount },
        { label: "Intervenants", value: viewModel.intervenantCount },
        { label: "Intervenants actifs", value: viewModel.activeIntervenantCount },
        { label: "Actions chantier", value: viewModel.actionCount },
        { label: "Documents", value: viewModel.documentCount },
        { label: "Erreurs", value: viewModel.errorCount },
        { label: "Warnings", value: viewModel.warningCount },
      ])
    );

    const financeCard = renderCard(
      "Finances",
      renderKeyValueList([
        { label: "Total marchés HT", value: formatCurrency(viewModel.totalMontantMarcheHt) },
        { label: "Total marchés TTC", value: formatCurrency(viewModel.totalMontantMarcheTtc) },
        { label: "Montant engagé HT", value: formatCurrency(viewModel.totalMontantEngageHt) },
        { label: "Montant réglé HT", value: formatCurrency(viewModel.totalMontantRegleHt) },
        { label: "Facturation TTC", value: formatCurrency(viewModel.totalFactureTtc) },
        { label: "Facturation réglée", value: formatCurrency(viewModel.totalFactureReglee) },
      ])
    );

    const lotsCard = renderCard(
      "Lots",
      renderTable(
        [
          { key: "id", header: "Lot_ID" },
          { key: "designation", header: "Nom lot" },
          { key: "entrepriseId", header: "Entreprise" },
          { key: "statut", header: "Statut" },
          {
            key: "avancement",
            header: "Avancement",
            render: (value) => `${Number(value)}%`,
          },
          {
            key: "montantHt",
            header: "Montant HT",
            render: (value) => formatCurrency(Number(value)),
          },
        ],
        viewModel.lots,
        "Aucun lot disponible."
      )
    );

    const issuesCard = renderCard(
      "Top alertes",
      renderTable(
        [
          {
            key: "severity",
            header: "Sévérité",
            render: (value) => {
              const severity = String(value);

              if (severity === "error") {
                return renderBadge("error", "ko");
              }

              if (severity === "warning") {
                return renderBadge("warning", "warn");
              }

              return renderBadge(severity, "neutral");
            },
          },
          { key: "scope", header: "Périmètre" },
          { key: "message", header: "Message" },
        ],
        viewModel.topIssues,
        "Aucune alerte."
      )
    );

    const content = `
      ${projectCard}
      ${kpiCard}
      ${summaryCard}
      ${financeCard}
      ${lotsCard}
      ${issuesCard}
    `;

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
