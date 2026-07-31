import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { escapeCsv } from "../utils/csv";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "documents.csv");

  try {
    const data = loadProjectData(basePath);
    const headers = [
      "Document_ID",
      "Lot_ID",
      "Reference",
      "Type_Document",
      "Date_Document",
      "Version",
      "Statut_Validation",
    ];

    const rows = data.documents.map((document) =>
      [
        document.Document_ID,
        document.Lot_ID,
        document.Reference,
        document.Type_Document,
        document.Date_Document,
        document.Version,
        document.Statut_Validation,
      ]
        .map(escapeCsv)
        .join(";")
    );

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, [headers.join(";"), ...rows].join("\n"), "utf-8");

    console.log(`Export CSV généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export CSV des documents.");
    console.error(error);
    process.exit(1);
  }
}

main();
