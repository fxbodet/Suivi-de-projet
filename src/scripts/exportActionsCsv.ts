import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { escapeCsv } from "../utils/csv";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "actions.csv");

  try {
    const data = loadProjectData(basePath);
    const headers = [
      "Action_ID",
      "Lot_ID",
      "Description_Action",
      "Responsable",
      "Statut_Action",
      "Priorite",
      "Date_Echeance",
    ];

    const rows = data.actions_chantier.map((action) =>
      [
        action.Action_ID,
        action.Lot_ID,
        action.Description_Action,
        action.Responsable,
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
