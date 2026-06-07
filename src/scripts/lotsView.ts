import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { renderLotsView } from "../ui/lotsView";

function main() {
  const basePath = path.resolve(process.cwd());

  try {
    const data = loadProjectData(basePath);
    console.log(renderLotsView(data.lots, process.argv.slice(2)));
  } catch (error) {
    console.error("Erreur lors de la génération de la vue lots.");
    console.error(error);
    process.exit(1);
  }
}

main();
