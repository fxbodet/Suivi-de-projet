import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";

function badgeClass(actif: boolean): string {
  return actif ? "badge-ok" : "badge-ko";
}

function badgeLabel(actif: boolean): string {
  return actif ? "Actif" : "Inactif";
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
            <td>${intervenant.Nom_Intervenant}</td>
            <td>${intervenant.Role_Intervenant}</td>
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
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 32px;
        background: #f8fafc;
        color: #1e293b;
      }
      h1 {
        color: #0f172a;
      }
      .nav {
        margin-bottom: 20px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .nav a {
        text-decoration: none;
        color: white;
        background: #2563eb;
        padding: 10px 14px;
        border-radius: 8px;
      }
      .card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
      }
      th, td {
        border-bottom: 1px solid #ddd;
        text-align: left;
        padding: 10px;
      }
      th {
        background: #e2e8f0;
      }
      .badge-ok {
        color: #166534;
        font-weight: bold;
      }
      .badge-ko {
        color: #991b1b;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>Liste des intervenants</h1>

    <nav class="nav">
      <a href="./dashboard.html">Dashboard</a>
      <a href="./lots.html">Lots</a>
      <a href="./validation.html">Validation</a>
      <a href="./intervenants.html">Intervenants</a>
      <a href="./actions.html">Actions</a>
    </nav>

    <div class="card">
      <table>
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
