import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "documents.html");

  try {
    const data = loadProjectData(basePath);

    const rows = data.documents
      .map(
        (document) => `
          <tr>
            <td>${document.Document_ID}</td>
            <td>${document.Lot_ID}</td>
            <td>${document.Nom_Document}</td>
            <td>${document.Type_Document}</td>
            <td>${document.Date_Document}</td>
            <td>${document.Version}</td>
            <td>${document.Statut_Document}</td>
          </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Documents projet</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>Documents projet</h1>

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
            <th>Document_ID</th>
            <th>Lot_ID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Date</th>
            <th>Version</th>
            <th>Statut</th>
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
    console.error("Erreur lors de l'export HTML des documents.");
    console.error(error);
    process.exit(1);
  }
}

main();
