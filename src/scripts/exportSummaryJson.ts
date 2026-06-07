import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { buildProjectSummary } from "../reporting/projectSummary";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "summary.json");

  try {
    const data = loadProjectData(basePath);
    const summary = buildProjectSummary(data);

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2), "utf-8");

    console.log(`Export JSON généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export de la synthèse JSON.");
    console.error(error);
    process.exit(1);
  }
}

main();
