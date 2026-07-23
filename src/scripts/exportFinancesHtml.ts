import fs from "node:fs";
import path from "node:path";

import { buildFinancesViewModel } from "../services/financesService";
import { getProjectContext } from "../services/projectService";
import { renderCard, renderKeyValueList, renderTable } from "../ui/components";
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
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "finances.html");

  try {
    const { data } = getProjectContext(basePath);
    const viewModel = buildFinancesViewModel(data);

    const summaryCard = renderCard(
      "Résumé financier",
      renderKeyValueList([
        { label: "Total marchés HT", value: formatCurrency(viewModel.totalMontantMarcheHt) },
        { label: "Total marchés TTC", value: formatCurrency(viewModel.totalMontantMarcheTtc) },
        { label: "Total engagé HT", value: formatCurrency(viewModel.totalMontantEngageHt) },
        { label: "Total réglé HT", value: formatCurrency(viewModel.totalMontantRegleHt) },
        { label: "Reste à engager HT", value: formatCurrency(viewModel.totalResteAEngagerHt) },
        { label: "Reste à régler HT", value: formatCurrency(viewModel.totalResteAReglerHt) },
      ])
    );

    const lotsFinanceCard = renderCard(
      "Finances par lot",
      renderTable(
        [
          { key: "id", header: "Lot_ID" },
          { key: "designation", header: "Désignation" },
          {
            key: "montantMarcheHt",
            header: "Marché HT",
            render: (value) => formatCurrency(Number(value)),
          },
          {
            key: "montantMarcheTtc",
            header: "Marché TTC",
            render: (value) => formatCurrency(Number(value)),
          },
          {
            key: "montantEngageHt",
            header: "Engagé HT",
            render: (value) => formatCurrency(Number(value)),
          },
          {
            key: "montantRegleHt",
            header: "Réglé HT",
            render: (value) => formatCurrency(Number(value)),
          },
          {
            key: "resteAEngagerHt",
            header: "Reste à engager HT",
            render: (value) => formatCurrency(Number(value)),
          },
          {
            key: "resteAReglerHt",
            header: "Reste à régler HT",
            render: (value) => formatCurrency(Number(value)),
          },
        ],
        viewModel.lots,
        "Aucune donnée financière disponible."
      )
    );

    const content = `
      ${summaryCard}
      ${lotsFinanceCard}
    `;

    const html = renderPageLayout({
      title: "Vue finances",
      navigation: renderDashboardNavigation("finances"),
      content,
    });

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export de la vue finances HTML.");
    console.error(error);
    process.exit(1);
  }
}

main();
