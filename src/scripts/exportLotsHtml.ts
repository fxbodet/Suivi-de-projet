import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { renderBadge, renderCard, renderTable } from "../ui/components";
import { formatCurrency } from "../ui/formatters";
import { renderPageLayout } from "../ui/layout";
import { renderDashboardNavigation } from "../ui/navigation";

const LOT_STATUS_MAP: Record<string, "ok" | "warn" | "ko" | "neutral"> = {
  TERMINE: "ok",
  EN_COURS: "warn",
  PREVU: "neutral",
  BLOQUE: "ko",
  ANNULE: "neutral",
};

function lotStatusTone(status: string): "ok" | "warn" | "ko" | "neutral" {
  return LOT_STATUS_MAP[status.toUpperCase()] ?? "ko";
}

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "lots.html");

  try {
    const data = loadProjectData(basePath);
    const sortedLots = [...data.lots].sort((a, b) => b.Montant_Marche_HT - a.Montant_Marche_HT);

    const lotsCard = renderCard(
      "Liste des lots",
      renderTable(
        [
          { key: "Lot_ID", header: "Lot_ID" },
          { key: "Designation_Lot", header: "Nom lot" },
          { key: "Entreprise_ID", header: "Entreprise" },
          {
            key: "Statut_Lot",
            header: "Statut",
            render: (value) => renderBadge(String(value), lotStatusTone(String(value))),
          },
          {
            key: "Avancement_Pourcent",
            header: "Avancement",
            render: (value) => `${Number(value)}%`,
          },
          {
            key: "Montant_Marche_HT",
            header: "Montant HT",
            render: (value) => formatCurrency(Number(value)),
          },
          {
            key: "Montant_Marche_TTC",
            header: "Montant TTC",
            render: (value) => formatCurrency(Number(value)),
          },
        ],
        sortedLots,
        "Aucun lot disponible."
      )
    );

    const html = renderPageLayout({
      title: "Liste des lots",
      navigation: renderDashboardNavigation("lots"),
      content: lotsCard,
    });

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export HTML des lots.");
    console.error(error);
    process.exit(1);
  }
}

main();
