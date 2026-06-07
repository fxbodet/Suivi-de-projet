import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "lots.html");

  try {
    const data = loadProjectData(basePath);
    const sortedLots = [...data.lots].sort((a, b) => b.Montant_Marche_HT - a.Montant_Marche_HT);

    const rows = sortedLots
      .map(
        (lot) => `
          <tr>
            <td>${lot.Lot_ID}</td>
            <td>${lot.Nom_Lot}</td>
            <td>${lot.Entreprise_Attributaire}</td>
            <td>${lot.Statut_Lot}</td>
            <td>${lot.Avancement_Pourcent}%</td>
            <td>${formatCurrency(lot.Montant_Marche_HT)}</td>
            <td>${formatCurrency(lot.Montant_Marche_TTC)}</td>
          </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Liste des lots</title>
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
    </style>
  </head>
  <body>
    <h1>Liste des lots</h1>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Lot_ID</th>
            <th>Nom lot</th>
            <th>Entreprise</th>
            <th>Statut</th>
            <th>Avancement</th>
            <th>Montant HT</th>
            <th>Montant TTC</th>
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
    console.error("Erreur lors de l'export HTML des lots.");
    console.error(error);
    process.exit(1);
  }
}

main();
