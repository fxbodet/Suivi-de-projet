import fs from "node:fs";
import path from "node:path";

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const outputFile = path.join(outputDir, "index.html");

  const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Accueil projet</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1>Accueil du projet</h1>

    <div class="card">
      <h2>Navigation</h2>
      <div class="home-links">
        <a href="./dashboard.html">Dashboard</a>
        <a href="./lots.html">Lots</a>
        <a href="./validation.html">Validation</a>
        <a href="./intervenants.html">Intervenants</a>
        <a href="./actions.html">Actions</a>
        <a href="./documents.html">Documents</a>
        <a href="./finances.html">Finances</a>
      </div>
    </div>
  </body>
</html>`;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, html, "utf-8");

  console.log(`Export HTML généré : ${outputFile}`);
}

main();
