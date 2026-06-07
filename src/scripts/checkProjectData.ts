import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { validateProjectData } from "../validation";

function main() {
  const basePath = process.cwd();
  const resolvedBasePath = path.resolve(basePath);

  console.log(`Chargement des données depuis : ${resolvedBasePath}`);

  try {
    const data = loadProjectData(resolvedBasePath);
    const report = validateProjectData(data);

    console.log("");
    console.log("=== Résumé validation ===");
    console.log(`Erreurs   : ${report.errorCount}`);
    console.log(`Warnings  : ${report.warningCount}`);
    console.log(`Valide    : ${report.isValid ? "Oui" : "Non"}`);
    console.log("");

    if (report.issues.length > 0) {
      console.log("=== Détail des issues ===");
      report.issues.forEach((issue, index) => {
        console.log(
          `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.scope} - ${issue.message}`
        );
      });
    } else {
      console.log("Aucune anomalie détectée.");
    }

    console.log("");
    console.log("=== Volumétrie chargée ===");
    console.log(`projet              : ${data.projet.length}`);
    console.log(`phases_mop          : ${data.phases_mop.length}`);
    console.log(`lots                : ${data.lots.length}`);
    console.log(`planning            : ${data.planning.length}`);
    console.log(`intervenants        : ${data.intervenants.length}`);
    console.log(`marches             : ${data.marches.length}`);
    console.log(`cctp                : ${data.cctp.length}`);
    console.log(`dqe                 : ${data.dqe.length}`);
    console.log(`situations          : ${data.situations.length}`);
    console.log(`chantier_cr         : ${data.chantier_cr.length}`);
    console.log(`actions_chantier    : ${data.actions_chantier.length}`);
    console.log(`facturation_client  : ${data.facturation_client.length}`);
    console.log(`suivi_financier     : ${data.suivi_financier.length}`);
    console.log(`documents           : ${data.documents.length}`);
    console.log(`ccap                : ${data.ccap.length}`);
    console.log(`tableau_de_bord     : ${data.tableau_de_bord.length}`);
  } catch (error) {
    console.error("Erreur lors du chargement ou de la validation des données.");
    console.error(error);
    process.exit(1);
  }
}

main();
