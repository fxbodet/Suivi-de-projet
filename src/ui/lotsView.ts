import { Lot } from "../domain/types";
import { divider, formatCurrency, pad } from "./formatters";

function parseArgs(args: string[]) {
  const options = {
    sort: undefined as "nom" | "montant" | "avancement" | undefined,
    limit: undefined as number | undefined,
  };

  args.forEach((arg) => {
    if (arg.startsWith("--sort=")) {
      const value = arg.split("=")[1];
      if (value === "nom" || value === "montant" || value === "avancement") {
        options.sort = value;
      }
    }

    if (arg.startsWith("--limit=")) {
      const value = Number(arg.split("=")[1]);
      if (!Number.isNaN(value) && value > 0) {
        options.limit = value;
      }
    }
  });

  return options;
}

function sortLots(lots: Lot[], args: string[]): Lot[] {
  const options = parseArgs(args);
  const sorted = [...lots];

  if (options.sort === "nom") {
    sorted.sort((a, b) => a.Designation_Lot.localeCompare(b.Designation_Lot, "fr"));
  }

  if (options.sort === "montant") {
    sorted.sort((a, b) => b.Montant_Marche_HT - a.Montant_Marche_HT);
  }

  if (options.sort === "avancement") {
    sorted.sort((a, b) => b.Avancement_Pourcent - a.Avancement_Pourcent);
  }

  if (options.limit) {
    return sorted.slice(0, options.limit);
  }

  return sorted;
}

export function renderLotsView(lots: Lot[], args: string[] = []): string {
  const displayedLots = sortLots(lots, args);
  const lines = [
    divider(120, "="),
    "LISTE DES LOTS",
    divider(120, "="),
    "",
    `${pad("Lot_ID", 12)} ${pad("Nom lot", 28)} ${pad("Entreprise", 24)} ${pad("Statut", 16)} ${pad("Avancement", 12)} Montant HT`,
    divider(120),
  ];

  displayedLots.forEach((lot) => {
    lines.push(
      `${pad(lot.Lot_ID, 12)} ${pad(lot.Designation_Lot, 28)} ${pad(lot.Entreprise_ID, 24)} ${pad(lot.Statut_Lot, 16)} ${pad(`${lot.Avancement_Pourcent}%`, 12)} ${formatCurrency(lot.Montant_Marche_HT)}`
    );
  });

  lines.push("");
  lines.push(`Total affiché : ${displayedLots.length}`);
  lines.push(`Total lots    : ${lots.length}`);
  lines.push(divider(120, "="));

  return lines.join("\n");
}
