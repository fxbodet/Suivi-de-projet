import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { renderBadge, renderCard, renderTable } from "../ui/components";
import { renderPageLayout } from "../ui/layout";
import { renderDashboardNavigation } from "../ui/navigation";

const DOCUMENT_STATUS_MAP: Record<string, "ok" | "warn" | "ko" | "neutral"> = {
  VALIDE: "ok",
  APPROUVE: "ok",
  DIFFUSE: "ok",
  EN_ATTENTE: "warn",
  EN_REVUE: "warn",
  EN_COURS: "warn",
  REFUSE: "ko",
};

function documentStatusTone(status: string): "ok" | "warn" | "ko" | "neutral" {
  const upper = status.toUpperCase().replace(/\s+/g, "_");
  if (DOCUMENT_STATUS_MAP[upper]) return DOCUMENT_STATUS_MAP[upper];
  const normalized = status.toLowerCase();
  if (normalized.includes("valid") || normalized.includes("approuv") || normalized.includes("diffus")) return "ok";
  if (normalized.includes("attente") || normalized.includes("revue") || normalized.includes("cours")) return "warn";
  return "neutral";
}

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "documents.html");

  try {
    const data = loadProjectData(basePath);

    const documentsCard = renderCard(
      "Documents projet",
      renderTable(
        [
          { key: "Document_ID", header: "Document_ID" },
          { key: "Lot_ID", header: "Lot_ID" },
          { key: "Reference", header: "Nom" },
          { key: "Type_Document", header: "Type" },
          { key: "Date_Document", header: "Date" },
          { key: "Version", header: "Version" },
          {
            key: "Statut_Validation",
            header: "Statut",
            render: (value) => renderBadge(String(value), documentStatusTone(String(value))),
          },
        ],
        data.documents,
        "Aucun document disponible."
      )
    );

    const html = renderPageLayout({
      title: "Documents projet",
      navigation: renderDashboardNavigation("documents"),
      content: documentsCard,
    });

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export HTML des documents.");
    console.error(error);
    process.exit(1);
  }
}

main();
