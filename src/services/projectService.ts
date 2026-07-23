import path from "node:path";

import { ProjectDataBundle } from "../domain/types";
import { loadProjectData } from "../import/loadProjectData";
import { ProjectSummary, buildProjectSummary } from "../reporting/projectSummary";
import { ValidationReport, validateProjectData } from "../validation";

export interface ProjectContext {
  basePath: string;
  data: ProjectDataBundle;
  summary: ProjectSummary;
  validation: ValidationReport;
}

export function getProjectContext(basePath = process.cwd()): ProjectContext {
  const resolvedBasePath = path.resolve(basePath);
  const data = loadProjectData(resolvedBasePath);
  const summary = buildProjectSummary(data);
  const validation = validateProjectData(data);

  return {
    basePath: resolvedBasePath,
    data,
    summary,
    validation,
  };
}
