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
  const outputFile = path.join(outputDir, "lots.csv");

  try {
    const data = loadProjectData(basePath);
    const headers = [
      "Lot_ID",
      "Nom_Lot",
      "Entreprise_Attributaire",
      "Statut_Lot",
      "Avancement_Pourcent",
      "Montant_Marche_HT",
      "Montant_Marche_TTC",
    ];

    const rows = data.lots.map((lot) =>
      [
        lot.Lot_ID,
        lot.Nom_Lot,
        lot.Entreprise_Attributaire,
        lot.Statut_Lot,
        lot.Avancement_Pourcent,
        lot.Montant_Marche_HT,
        lot.Montant_Marche_TTC,
      ]
        .map(escapeCsv)
        .join(";")
    );

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, [headers.join(";"), ...rows].join("\n"), "utf-8");

    console.log(`Export CSV généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export CSV des lots.");
    console.error(error);
    process.exit(1);
  }
}

main();
