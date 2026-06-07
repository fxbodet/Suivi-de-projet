import { ValidationIssue } from "../validation/validateRelations";
import { divider } from "./formatters";

function groupIssuesByScope(issues: ValidationIssue[]): Map<string, ValidationIssue[]> {
  const groups = new Map<string, ValidationIssue[]>();

  issues.forEach((issue) => {
    const current = groups.get(issue.scope) ?? [];
    current.push(issue);
    groups.set(issue.scope, current);
  });

  return groups;
}

function parseArgs(args: string[]) {
  const options = {
    severity: undefined as "error" | "warning" | undefined,
    scope: undefined as string | undefined,
    search: undefined as string | undefined,
  };

  args.forEach((arg) => {
    if (arg.startsWith("--severity=")) {
      const value = arg.split("=")[1];
      if (value === "error" || value === "warning") {
        options.severity = value;
      }
    }

    if (arg.startsWith("--scope=")) {
      options.scope = arg.split("=")[1];
    }

    if (arg.startsWith("--search=")) {
      options.search = arg.split("=").slice(1).join("=").toLowerCase();
    }
  });

  return options;
}

function filterIssues(issues: ValidationIssue[], args: string[]): ValidationIssue[] {
  const options = parseArgs(args);

  return issues.filter((issue) => {
    if (options.severity && issue.severity !== options.severity) {
      return false;
    }

    if (options.scope && issue.scope !== options.scope) {
      return false;
    }

    if (options.search && !issue.message.toLowerCase().includes(options.search)) {
      return false;
    }

    return true;
  });
}

function renderSection(title: string, issues: ValidationIssue[]): string[] {
  const lines = [divider(72, "="), `${title.toUpperCase()} (${issues.length})`, divider(72, "=")];

  if (issues.length === 0) {
    lines.push("Aucune entrée.");
    return lines;
  }

  const grouped = groupIssuesByScope(issues);

  grouped.forEach((scopeIssues, scope) => {
    lines.push("");
    lines.push(`[${scope}]`);
    lines.push(divider(40));
    scopeIssues.forEach((issue, index) => {
      lines.push(`${index + 1}. ${issue.message}`);
    });
  });

  return lines;
}

export function renderValidationView(issues: ValidationIssue[], args: string[] = []): string {
  const filtered = filterIssues(issues, args);
  const errors = filtered.filter((issue) => issue.severity === "error");
  const warnings = filtered.filter((issue) => issue.severity === "warning");

  return [
    ...renderSection("Erreurs", errors),
    "",
    ...renderSection("Warnings", warnings),
  ].join("\n");
}
