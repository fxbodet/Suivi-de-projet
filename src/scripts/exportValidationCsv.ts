import fs from "node:fs";
import path from "node:path";

import { loadProjectData } from "../import/loadProjectData";
import { validateProjectData } from "../validation";
import { ValidationIssue } from "../validation/validateRelations";

function escapeCsv(value: string | number): string {
  const text = String(value ?? "");
  if (text.includes(";") || text.includes("\n") || text.includes('"')) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function toCsv(issues: ValidationIssue[]): string {
  const headers = ["severity", "scope", "message"];
  const rows = issues.map((issue) =>
    [issue.severity, issue.scope, issue.message].map(escapeCsv).join(";")
  );

  return [headers.join(";"), ...rows].join("\n");
}

function main() {
  const basePath = path.resolve(process.cwd());
  const outputDir = path.join(basePath, "output");
  const errorsFile = path.join(outputDir, "validation-errors.csv");
  const warningsFile = path.join(outputDir, "validation-warnings.csv");

  try {
    const data = loadProjectData(basePath);
    const validation = validateProjectData(data);
    const errors = validation.issues.filter((issue) => issue.severity === "error");
    const warnings = validation.issues.filter((issue) => issue.severity === "warning");

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(errorsFile, toCsv(errors), "utf-8");
    fs.writeFileSync(warningsFile, toCsv(warnings), "utf-8");

    console.log(`Export CSV généré : ${errorsFile}`);
    console.log(`Export CSV généré : ${warningsFile}`);
  } catch (error) {
    console.error("Erreur lors de l'export CSV de la validation.");
    console.error(error);
    process.exit(1);
  }
}

main();
