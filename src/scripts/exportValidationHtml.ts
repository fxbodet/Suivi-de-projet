import fs from "node:fs";
import path from "node:path";

import { ValidationIssue } from "../domain/types";
import { loadProjectData } from "../import/loadProjectData";
import { renderBadge, renderCard, renderTable } from "../ui/components";
import { renderPageLayout } from "../ui/layout";
import { renderDashboardNavigation } from "../ui/navigation";
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

    const issueColumns = [
      { key: "scope" as keyof ValidationIssue, header: "Périmètre" },
      { key: "message" as keyof ValidationIssue, header: "Message" },
    ];

    const errorsCard = renderCard(
      `Erreurs (${errors.length})`,
      renderTable(issueColumns, errors, "Aucune erreur.")
    );

    const warningsCard = renderCard(
      `Warnings (${warnings.length})`,
      renderTable(issueColumns, warnings, "Aucun warning.")
    );

    const statusBadge = renderBadge(
      validation.isValid ? "Valide" : "Invalide",
      validation.isValid ? "ok" : "ko"
    );

    const summaryCard = renderCard(
      "Résumé validation",
      `<p>Statut : ${statusBadge}</p><p>Erreurs : ${validation.errorCount} — Warnings : ${validation.warningCount}</p>`
    );

    const content = `${summaryCard}${errorsCard}${warningsCard}`;

    const html = renderPageLayout({
      title: "Validation projet",
      navigation: renderDashboardNavigation("validation"),
      content,
    });

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
