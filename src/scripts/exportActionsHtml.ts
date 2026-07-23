import fs from "node:fs";
import path from "node:path";

import { buildActionsViewModel } from "../services/actionsService";
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
  const outputFile = path.join(outputDir, "actions.html");

  try {
    const { data } = getProjectContext(basePath);
    const viewModel = buildActionsViewModel(data);

    const summaryCard = renderCard(
      "Résumé des actions",
      renderKeyValueList([
        { label: "Total actions", value: viewModel.totalActions },
        { label: "Actions ouvertes", value: viewModel.openActions },
        { label: "Actions closes", value: viewModel.closedActions },
        { label: "Actions en retard", value: viewModel.lateActions },
      ])
    );

    const actionsCard = renderCard(
      "Liste des actions",
      renderTable(
        [
          { key: "id", header: "Action_ID" },
          { key: "lotId", header: "Lot_ID" },
          { key: "titre", header: "Titre" },
          { key: "responsable", header: "Responsable" },
          { key: "dateEcheance", header: "Échéance" },
          {
            key: "statut",
            header: "Statut",
            render: (value, row) =>
              renderBadge(String(value || "Non renseigné"), row.isClosed ? "ok" : "neutral"),
          },
          { key: "priorite", header: "Priorité" },
          {
            key: "isLate",
            header: "Retard",
            render: (value) => renderBadge(value ? "Oui" : "Non", value ? "ko" : "ok"),
          },
        ],
        viewModel.actions,
        "Aucune action disponible."
      )
    );

    const content = `
      ${summaryCard}
      ${actionsCard}
    `;

    const html = renderPageLayout({
      title: "Vue actions",
      navigation: renderDashboardNavigation("actions"),
      content,
    });

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export de la vue actions HTML.");
    console.error(error);
    process.exit(1);
  }
}

main();
