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
  const outputFile = path.join(outputDir, "intervenants.csv");

  try {
    const data = loadProjectData(basePath);
    const headers = ["Intervenant_ID", "Raison_Sociale", "Fonction", "Email", "Telephone", "Actif"];

    const rows = data.intervenants.map((intervenant) =>
      [
        intervenant.Intervenant_ID,
        intervenant.Raison_Sociale,
        intervenant.Fonction,
        intervenant.Email,
        intervenant.Telephone,
        intervenant.Actif,
      ]
        .map(escapeCsv)
        .join(";")
    );

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, [headers.join(";"), ...rows].join("\n"), "utf-8");

    console.log(`Export CSV généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export CSV des intervenants.");
    console.error(error);
    process.exit(1);
  }
}

main();
