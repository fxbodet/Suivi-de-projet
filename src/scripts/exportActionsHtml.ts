import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";

function actionStatusClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("termin") || normalized.includes("clos") || normalized.includes("valid")) return "status status-ok";
  if (normalized.includes("cours") || normalized.includes("progress") || normalized.includes("attente")) return "status status-warn";
  return "status status-ko";
}

function priorityClass(priority: string): string {
  const normalized = priority.toLowerCase();
  if (normalized.includes("haute") || normalized.includes("urgent") || normalized.includes("crit")) return "status status-ko";
  if (normalized.includes("moy")) return "status status-warn";
  return "status status-ok";
}

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "actions.html");

  try {
    const data = loadProjectData(basePath);

    const rows = data.actions_chantier
      .map(
        (action) => `
          <tr>
            <td>${action.Action_ID}</td>
            <td>${action.Lot_ID}</td>
            <td>${action.Description_Action}</td>
            <td><span class="${actionStatusClass(action.Statut_Action)}">${action.Statut_Action}</span></td>
            <td><span class="${priorityClass(action.Priorite)}">${action.Priorite}</span></td>
            <td>${action.Date_Echeance}</td>
          </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Actions chantier</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>Actions chantier</h1>

    <nav class="nav">
      <a href="./dashboard.html">Dashboard</a>
      <a href="./lots.html">Lots</a>
      <a href="./validation.html">Validation</a>
      <a href="./intervenants.html">Intervenants</a>
      <a href="./actions.html">Actions</a>
      <a href="./documents.html">Documents</a>
      <a href="./finances.html">Finances</a>
    </nav>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Action_ID</th>
            <th>Lot_ID</th>
            <th>Description</th>
            <th>Statut</th>
            <th>Priorité</th>
            <th>Échéance</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </body>
</html>`;

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export HTML des actions chantier.");
    console.error(error);
    process.exit(1);
  }
}

main();
