import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";

function badgeClass(actif: string): string {
  return actif === "Oui" ? "badge-ok" : "badge-ko";
}

function badgeLabel(actif: string): string {
  return actif === "Oui" ? "Actif" : "Inactif";
}

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "intervenants.html");

  try {
    const data = loadProjectData(basePath);

    const rows = data.intervenants
      .map(
        (intervenant) => `
          <tr>
            <td>${intervenant.Intervenant_ID}</td>
            <td>${intervenant.Raison_Sociale}</td>
            <td>${intervenant.Fonction}</td>
            <td>${intervenant.Email}</td>
            <td>${intervenant.Telephone}</td>
            <td><span class="${badgeClass(intervenant.Actif)}">${badgeLabel(intervenant.Actif)}</span></td>
          </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Liste des intervenants</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>Liste des intervenants</h1>

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
            <th>Intervenant_ID</th>
            <th>Nom</th>
            <th>Rôle</th>
            <th>Email</th>
            <th>Téléphone</th>
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
    console.error("Erreur lors de l'export HTML des intervenants.");
    console.error(error);
    process.exit(1);
  }
}

main();
