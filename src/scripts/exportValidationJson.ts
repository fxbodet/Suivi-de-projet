import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { validateProjectData } from "../validation";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "validation.json");

  try {
    const data = loadProjectData(basePath);
    const validation = validateProjectData(data);

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(validation, null, 2), "utf-8");

    console.log(`Export JSON généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export de la validation JSON.");
    console.error(error);
    process.exit(1);
  }
}

main();
