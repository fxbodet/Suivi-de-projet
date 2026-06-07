import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { validateProjectData } from "../validation";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "validation.html");

  try {
    const data = loadProjectData(basePath);
    const validation = validateProjectData(data);
    const errors = validation.issues.filter((issue) => issue.severity === "error");
    const warnings = validation.issues.filter((issue) => issue.severity === "warning");

    const renderItems = (items: typeof validation.issues) =>
      items.length === 0
        ? "<li>Aucune entrée.</li>"
        : items
            .map(
              (issue) => `
                <li>
                  <strong>[${issue.scope}]</strong> ${issue.message}
                </li>`
            )
            .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Validation projet</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>Validation projet</h1>

    <nav class="nav">
      <a href="./dashboard.html">Dashboard</a>
      <a href="./lots.html">Lots</a>
      <a href="./validation.html">Validation</a>
      <a href="./intervenants.html">Intervenants</a>
      <a href="./actions.html">Actions</a>
      <a href="./documents.html">Documents</a>
      <a href="./finances.html">Finances</a>
    </nav>

    <div class="card errors">
      <h2>Erreurs (${errors.length})</h2>
      <ul class="list">${renderItems(errors)}</ul>
    </div>

    <div class="card warnings">
      <h2>Warnings (${warnings.length})</h2>
      <ul class="list">${renderItems(warnings)}</ul>
    </div>
  </body>
</html>`;

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, html, "utf-8");

    console.log(`Export HTML généré : ${outputFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export HTML de validation.");
    console.error(error);
    process.exit(1);
  }
}

main();
