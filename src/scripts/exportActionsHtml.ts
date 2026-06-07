import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";

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
            <td>${action.Statut_Action}</td>
            <td>${action.Priorite}</td>
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
