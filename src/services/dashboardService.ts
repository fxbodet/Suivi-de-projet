import { ProjectDataBundle } from "../domain/types";
import { ProjectSummary } from "../reporting/projectSummary";
import { ValidationReport } from "../validation";

export interface DashboardLotItem {
  id: string;
  designation: string;
  entrepriseId: string;
  statut: string;
  avancement: number;
  montantHt: number;
}

export interface DashboardIssueItem {
  severity: string;
  scope: string;
  message: string;
}

export interface DashboardQuickLink {
  label: string;
  href: string;
}

export interface DashboardViewModel {
  projectName: string;
  projectOperation: string;
  budgetPrevuHt: number;
  isValid: boolean;
  lotCount: number;
  intervenantCount: number;
  activeIntervenantCount: number;
  actionCount: number;
  documentCount: number;
  errorCount: number;
  warningCount: number;
  totalMontantMarcheHt: number;
  totalMontantMarcheTtc: number;
  totalMontantEngageHt: number;
  totalMontantRegleHt: number;
  totalFactureTtc: number;
  totalFactureReglee: number;
  lots: DashboardLotItem[];
  topIssues: DashboardIssueItem[];
  quickLinks: DashboardQuickLink[];
}

interface BuildDashboardViewModelParams {
  data: ProjectDataBundle;
  summary: ProjectSummary;
  validation: ValidationReport;
}

function normalizeString(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/\s+/g, "").replace(",", ".").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function buildDashboardViewModel({
  data,
  summary,
  validation,
}: BuildDashboardViewModelParams): DashboardViewModel {
  const project = data.projet[0];

  const lots = data.lots.map((lot) => ({
    id: normalizeString(lot.Lot_ID),
    designation: normalizeString(lot.Designation_Lot),
    entrepriseId: normalizeString(lot.Entreprise_ID),
    statut: normalizeString(lot.Statut_Lot),
    avancement: toNumber(lot.Avancement_Pourcent),
    montantHt: toNumber(lot.Montant_Marche_HT),
  }));

  const topIssues = validation.issues.slice(0, 10).map((issue) => ({
    severity: normalizeString(issue.severity),
    scope: normalizeString(issue.scope),
    message: normalizeString(issue.message),
  }));

  return {
    projectName: normalizeString(project?.Nom_Projet) || "Projet",
    projectOperation: normalizeString(project?.Operation),
    budgetPrevuHt: toNumber(project?.Budget_Prevu_HT),
    isValid: validation.isValid,
    lotCount: summary.lotCount,
    intervenantCount: summary.intervenantCount,
    activeIntervenantCount: summary.activeIntervenantCount,
    actionCount: summary.actionCount,
    documentCount: summary.documentCount,
    errorCount: validation.errorCount,
    warningCount: validation.warningCount,
    totalMontantMarcheHt: summary.totalMontantMarcheHt,
    totalMontantMarcheTtc: summary.totalMontantMarcheTtc,
    totalMontantEngageHt: summary.totalMontantEngageHt,
    totalMontantRegleHt: summary.totalMontantRegleHt,
    totalFactureTtc: summary.totalFactureTtc,
    totalFactureReglee: summary.totalFactureReglee,
    lots: lots.slice(0, 10),
    topIssues,
    quickLinks: [
      { label: "Lots", href: "./lots.html" },
      { label: "Validation", href: "./validation.html" },
      { label: "Intervenants", href: "./intervenants.html" },
      { label: "Actions", href: "./actions.html" },
      { label: "Documents", href: "./documents.html" },
      { label: "Finances", href: "./finances.html" },
    ],
  };
}
