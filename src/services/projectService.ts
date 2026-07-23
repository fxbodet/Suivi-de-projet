import path from "node:path";

import { ProjectDataBundle } from "../domain/types";
import { ProjectSummary, buildProjectSummary } from "../reporting/projectSummary";
import { ValidationReport, validateProjectData } from "../validation";
import { loadProjectData } from "../import/loadProjectData";

export interface ProjectContext {
  basePath: string;
  data: ProjectDataBundle;
  summary: ProjectSummary;
  validation: ValidationReport;
}

export function getProjectContext(basePath = process.cwd()): ProjectContext {
  const resolvedBasePath = path.resolve(basePath);
  const data = loadProjectData(resolvedBasePath);

  return {
    basePath: resolvedBasePath,
    data,
    summary: buildProjectSummary(data),
    validation: validateProjectData(data),
  };
}
