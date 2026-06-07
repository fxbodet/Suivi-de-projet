import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { buildProjectSummary } from "../reporting/projectSummary";
import { renderDashboard } from "../ui/dashboard";
import { validateProjectData } from "../validation";

function main() {
  const basePath = path.resolve(process.cwd());

  try {
    const data = loadProjectData(basePath);
    const summary = buildProjectSummary(data);
    const validation = validateProjectData(data);

    console.log(renderDashboard(summary, validation));
  } catch (error) {
    console.error("Erreur lors de la génération du tableau de bord.");
    console.error(error);
    process.exit(1);
  }
}

main();
