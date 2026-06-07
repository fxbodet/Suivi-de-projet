import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { renderValidationView } from "../ui/validationView";
import { validateProjectData } from "../validation";

function main() {
  const basePath = path.resolve(process.cwd());

  try {
    const data = loadProjectData(basePath);
    const validation = validateProjectData(data);

    console.log(renderValidationView(validation.issues, process.argv.slice(2)));
  } catch (error) {
    console.error("Erreur lors de la génération de la vue validation.");
    console.error(error);
    process.exit(1);
  }
}

main();
