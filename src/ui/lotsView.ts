import { LotRow } from "../domain/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function pad(value: string, length: number): string {
  return value.length >= length ? value : value.padEnd(length, " ");
}

export function renderLotsView(lots: LotRow[]): string {
  const lines = [
    "=== Liste des lots ===",
    "",
    `${pad("Lot_ID", 12)} ${pad("Nom lot", 28)} ${pad("Entreprise", 24)} ${pad("Statut", 16)} ${pad("Avancement", 12)} Montant HT`,
    `${"-".repeat(12)} ${"-".repeat(28)} ${"-".repeat(24)} ${"-".repeat(16)} ${"-".repeat(12)} ${"-".repeat(14)}`,
  ];

  lots.forEach((lot) => {
    lines.push(
      `${pad(lot.Lot_ID, 12)} ${pad(lot.Nom_Lot, 28)} ${pad(lot.Entreprise_Attributaire, 24)} ${pad(lot.Statut_Lot, 16)} ${pad(`${lot.Avancement_Pourcent}%`, 12)} ${formatCurrency(lot.Montant_Marche_HT)}`
    );
  });

  return lines.join("\n");
}
