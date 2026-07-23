import { ProjectDataBundle } from "../domain/types";

export interface FinanceLotItem {
  id: string;
  designation: string;
  montantMarcheHt: number;
  montantMarcheTtc: number;
  montantEngageHt: number;
  montantRegleHt: number;
  resteAEngagerHt: number;
  resteAReglerHt: number;
}

export interface FinancesViewModel {
  totalMontantMarcheHt: number;
  totalMontantMarcheTtc: number;
  totalMontantEngageHt: number;
  totalMontantRegleHt: number;
  totalResteAEngagerHt: number;
  totalResteAReglerHt: number;
  lots: FinanceLotItem[];
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

export function buildFinancesViewModel(data: ProjectDataBundle): FinancesViewModel {
  const suiviByLotId = new Map(
    data.suivi_financier.map((item) => [item.Lot_ID, item])
  );

  const lots = data.lots.map((lot) => {
    const suivi = suiviByLotId.get(lot.Lot_ID);
    const montantMarcheHt = toNumber(suivi?.Montant_Marche_HT ?? lot.Montant_Marche_HT);
    const montantMarcheTtc = toNumber(lot.Montant_Marche_TTC);
    const montantEngageHt = toNumber(suivi?.Montant_Engage_HT);
    const montantRegleHt = toNumber(suivi?.Montant_Regle_HT);
    const resteAEngagerHt = toNumber(suivi?.Reste_A_Engager_HT ?? montantMarcheHt - montantEngageHt);
    const resteAReglerHt = toNumber(suivi?.Reste_A_Regler_HT ?? montantEngageHt - montantRegleHt);

    return {
      id: normalizeString(lot.Lot_ID),
      designation: normalizeString(lot.Designation_Lot),
      montantMarcheHt,
      montantMarcheTtc,
      montantEngageHt,
      montantRegleHt,
      resteAEngagerHt,
      resteAReglerHt,
    };
  });

  return {
    totalMontantMarcheHt: lots.reduce((sum, lot) => sum + lot.montantMarcheHt, 0),
    totalMontantMarcheTtc: lots.reduce((sum, lot) => sum + lot.montantMarcheTtc, 0),
    totalMontantEngageHt: lots.reduce((sum, lot) => sum + lot.montantEngageHt, 0),
    totalMontantRegleHt: lots.reduce((sum, lot) => sum + lot.montantRegleHt, 0),
    totalResteAEngagerHt: lots.reduce((sum, lot) => sum + lot.resteAEngagerHt, 0),
    totalResteAReglerHt: lots.reduce((sum, lot) => sum + lot.resteAReglerHt, 0),
    lots,
  };
}
