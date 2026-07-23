import { ProjectDataBundle } from "../domain/types";
import { ProjectSummary } from "../reporting/projectSummary";
import { ValidationReport } from "../validation";

export interface DashboardLotView {
  lotId: string;
  designation: string;
  entrepriseId: string;
  statut: string;
  avancementPourcent: number;
  montantMarcheHt: number;
}

export interface DashboardIssueView {
  severity: string;
  scope: string;
  message: string;
}

export interface DashboardQuickLink {
  href: string;
  label: string;
}

export interface DashboardKpi {
  title: string;
  value: number;
}

export interface DashboardViewData {
  lots: DashboardLotView[];
  topIssues: DashboardIssueView[];
  quickLinks: DashboardQuickLink[];
  visualKpis: DashboardKpi[];
}

const QUICK_LINKS: DashboardQuickLink[] = [
  { href: "./lots.html", label: "Voir les lots" },
  { href: "./validation.html", label: "Voir la validation" },
  { href: "./intervenants.html", label: "Voir les intervenants" },
  { href: "./actions.html", label: "Voir les actions" },
  { href: "./documents.html", label: "Voir les documents" },
  { href: "./finances.html", label: "Voir les finances" },
];

interface DashboardInput {
  data: ProjectDataBundle;
  summary: ProjectSummary;
  validation: ValidationReport;
}

export function buildDashboardViewData({ data, summary, validation }: DashboardInput): DashboardViewData {
  return {
    lots: data.lots.map((lot) => ({
      lotId: lot.Lot_ID,
      designation: lot.Designation_Lot,
      entrepriseId: lot.Entreprise_ID,
      statut: lot.Statut_Lot,
      avancementPourcent: lot.Avancement_Pourcent,
      montantMarcheHt: lot.Montant_Marche_HT,
    })),
    topIssues: validation.issues.slice(0, 10).map((issue) => ({
      severity: issue.severity,
      scope: issue.scope,
      message: issue.message,
    })),
    quickLinks: QUICK_LINKS,
    visualKpis: [
      { title: "Lots", value: summary.lotCount },
      { title: "Actions chantier", value: summary.actionCount },
      { title: "Documents", value: summary.documentCount },
      { title: "Erreurs", value: validation.errorCount },
    ],
  };
}
