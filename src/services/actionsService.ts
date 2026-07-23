import { ProjectDataBundle } from "../domain/types";

export interface ActionItem {
  id: string;
  lotId: string;
  titre: string;
  responsable: string;
  dateEcheance: string;
  statut: string;
  priorite: string;
  isLate: boolean;
  isClosed: boolean;
}

export interface ActionsViewModel {
  totalActions: number;
  openActions: number;
  closedActions: number;
  lateActions: number;
  actions: ActionItem[];
}

function normalizeString(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function parseDate(value: string): Date | null {
  const normalized = normalizeString(value);

  if (!normalized) {
    return null;
  }

  const direct = new Date(normalized);
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  const frenchMatch = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (frenchMatch) {
    const [, day, month, year] = frenchMatch;
    const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}

function isClosedStatus(value: string): boolean {
  const normalized = normalizeString(value).toLowerCase();

  return ["clos", "cloture", "clôturé", "cloturé", "closed", "done", "termine", "terminé"].includes(
    normalized
  );
}

export function buildActionsViewModel(data: ProjectDataBundle): ActionsViewModel {
  const now = new Date();

  const actions = data.actions_chantier.map((action) => {
    const titre = normalizeString(action.Description_Action) || "Action";
    const responsable = normalizeString(action.Responsable);
    const dateEcheance = normalizeString(action.Date_Echeance);
    const statut = normalizeString(action.Statut_Action);
    const priorite = normalizeString(action.Priorite);
    const parsedDate = parseDate(dateEcheance);
    const isClosed = isClosedStatus(statut);
    const isLate = Boolean(parsedDate && parsedDate.getTime() < now.getTime() && !isClosed);

    return {
      id: normalizeString(action.Action_ID),
      lotId: normalizeString(action.Lot_ID),
      titre,
      responsable,
      dateEcheance,
      statut,
      priorite,
      isLate,
      isClosed,
    };
  });

  return {
    totalActions: actions.length,
    openActions: actions.filter((action) => !action.isClosed).length,
    closedActions: actions.filter((action) => action.isClosed).length,
    lateActions: actions.filter((action) => action.isLate).length,
    actions,
  };
}
