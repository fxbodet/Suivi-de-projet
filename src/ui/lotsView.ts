import { LotRow } from "../domain/types";
import { divider, formatCurrency, pad } from "./formatters";

export function renderLotsView(lots: LotRow[]): string {
  const lines = [
    divider(120, "="),
    "LISTE DES LOTS",
    divider(120, "="),
    "",
    `${pad("Lot_ID", 12)} ${pad("Nom lot", 28)} ${pad("Entreprise", 24)} ${pad("Statut", 16)} ${pad("Avancement", 12)} Montant HT`,
    divider(120),
  ];

  lots.forEach((lot) => {
    lines.push(
      `${pad(lot.Lot_ID, 12)} ${pad(lot.Nom_Lot, 28)} ${pad(lot.Entreprise_Attributaire, 24)} ${pad(lot.Statut_Lot, 16)} ${pad(`${lot.Avancement_Pourcent}%`, 12)} ${formatCurrency(lot.Montant_Marche_HT)}`
    );
  });

  lines.push("");
  lines.push(`Total lots : ${lots.length}`);
  lines.push(divider(120, "="));

  return lines.join("\n");
}
