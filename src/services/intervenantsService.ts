import { ProjectDataBundle } from "../domain/types";

export interface IntervenantItem {
  id: string;
  nom: string;
  role: string;
  email: string;
  telephone: string;
  statut: string;
  isActive: boolean;
}

export interface IntervenantsViewModel {
  totalIntervenants: number;
  activeIntervenants: number;
  inactiveIntervenants: number;
  intervenants: IntervenantItem[];
}

function normalizeString(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

export function buildIntervenantsViewModel(data: ProjectDataBundle): IntervenantsViewModel {
  const intervenants = data.intervenants.map((intervenant) => {
    const statut = intervenant.Actif;

    return {
      id: normalizeString(intervenant.Intervenant_ID),
      nom: normalizeString(intervenant.Raison_Sociale) || "Intervenant",
      role: normalizeString(intervenant.Fonction),
      email: normalizeString(intervenant.Email),
      telephone: normalizeString(intervenant.Telephone),
      statut,
      isActive: statut === "Oui",
    };
  });

  return {
    totalIntervenants: intervenants.length,
    activeIntervenants: intervenants.filter((item) => item.isActive).length,
    inactiveIntervenants: intervenants.filter((item) => !item.isActive).length,
    intervenants,
  };
}
