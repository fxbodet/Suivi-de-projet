import { ValidationIssue } from "../validation/validateRelations";

function groupIssuesByScope(issues: ValidationIssue[]): Map<string, ValidationIssue[]> {
  const groups = new Map<string, ValidationIssue[]>();

  issues.forEach((issue) => {
    const current = groups.get(issue.scope) ?? [];
    current.push(issue);
    groups.set(issue.scope, current);
  });

  return groups;
}

function renderSection(title: string, issues: ValidationIssue[]): string[] {
  const lines = [`=== ${title} (${issues.length}) ===`];

  if (issues.length === 0) {
    lines.push("Aucune entrée.");
    return lines;
  }

  const grouped = groupIssuesByScope(issues);

  grouped.forEach((scopeIssues, scope) => {
    lines.push("");
    lines.push(`[${scope}]`);
    scopeIssues.forEach((issue, index) => {
      lines.push(`${index + 1}. ${issue.message}`);
    });
  });

  return lines;
}

export function renderValidationView(issues: ValidationIssue[]): string {
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");

  return [
    ...renderSection("Erreurs", errors),
    "",
    ...renderSection("Warnings", warnings),
  ].join("\n");
}
