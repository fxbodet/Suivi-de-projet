import { ProjectDataBundle, ValidationReport } from "../domain/types";
import { validateDuplicates } from "./validateDuplicates";
import { validateEnums } from "./validateEnums";
import { validateFinance } from "./validateFinance";
import { validatePlanning } from "./validatePlanning";
import { validateRelations } from "./validateRelations";

export type { ValidationReport };
export type { ValidationIssue } from "../domain/types";

export function validateProjectData(data: ProjectDataBundle): ValidationReport {
  const issues = [
    ...validateRelations(data),
    ...validateFinance(data),
    ...validatePlanning(data),
    ...validateDuplicates(data),
    ...validateEnums(data),
  ];

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;

  return {
    issues,
    errorCount,
    warningCount,
    isValid: errorCount === 0,
  };
}
