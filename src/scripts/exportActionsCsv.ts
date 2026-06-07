import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";

function escapeCsv(value: string | number): string {
  const text = String(value ?? "");
  if (text.includes(";") || text.includes("\n") || text.includes('"')) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "actions.csv");

  try {
    const data = loadProjectData(basePath);
    const headers = [
      "Action_ID",
      "Lot_ID",
      "Titre_Action",
      "Description_Action",
      "Statut_Action",
      "Priorite",
      "Date_Echeance",
    ];

    const rows = data.actions.map((action) =>
      [
        action.Action_ID,
        action.Lot_ID,
        action.Titre_Action,
        action.Description_Action,
        action.Statut_Action,
        action.Priorite,
        action.Date_Echeance,
      ]
        .map(escapeCsv)
        .join(";")
    );

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, [headers.join(";"), ...rows].join("\n"), "utf-8");

    console.log(`Export CSV généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export CSV des actions chantier.");
    console.error(error);
    process.exit(1);
  }
}

main();
