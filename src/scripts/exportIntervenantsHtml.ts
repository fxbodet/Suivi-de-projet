import fs from "node:fs";
import path from "node:path";

import { buildIntervenantsViewModel } from "../services/intervenantsService";
import { getProjectContext } from "../services/projectService";
import {
  renderBadge,
  renderCard,
  renderKeyValueList,
  renderTable,
} from "../ui/components";
import { renderPageLayout } from "../ui/layout";
import { renderDashboardNavigation } from "../ui/navigation";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "intervenants.html");

  try {
    const { data } = getProjectContext(basePath);
    const viewModel = buildIntervenantsViewModel(data);

    const summaryCard = renderCard(
      "Résumé des intervenants",
      renderKeyValueList([
        { label: "Total intervenants", value: viewModel.totalIntervenants },
        { label: "Actifs", value: viewModel.activeIntervenants },
        { label: "Inactifs", value: viewModel.inactiveIntervenants },
      ])
    );

    const intervenantsCard = renderCard(
      "Liste des intervenants",
      renderTable(
        [
          { key: "id", header: "Intervenant_ID" },
          { key: "nom", header: "Nom" },
          { key: "role", header: "Rôle" },
          { key: "email", header: "Email" },
          { key: "telephone", header: "Téléphone" },
          {
            key: "statut",
            header: "Statut",
            render: (value, row) =>
              renderBadge(String(value || "Non renseigné"), row.isActive ? "ok" : "neutral"),
          },
        ],
        viewModel.intervenants,
        "Aucun intervenant disponible."
      )
    );

    const content = `
      ${summaryCard}
      ${intervenantsCard}
    `;

    const html = renderPageLayout({
      title: "Vue intervenants",
      navigation: renderDashboardNavigation("intervenants"),
      content,
    });

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export de la vue intervenants HTML.");
    console.error(error);
    process.exit(1);
  }
}

main();
