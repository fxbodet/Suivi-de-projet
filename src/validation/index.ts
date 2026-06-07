import { ProjectDataBundle } from "../domain/types";
import { validateFinance } from "./validateFinance";
import { validatePlanning } from "./validatePlanning";
import { ValidationIssue, validateRelations } from "./validateRelations";

export interface ValidationReport {
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
  isValid: boolean;
}

export function validateProjectData(data: ProjectDataBundle): ValidationReport {
  const issues = [
    ...validateRelations(data),
    ...validateFinance(data),
    ...validatePlanning(data),
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
