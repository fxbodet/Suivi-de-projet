export type TsvRow = Record<string, string>;

function normalizeLineEndings(input: string): string {
  return input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function parseTsv(content: string): TsvRow[] {
  const normalized = normalizeLineEndings(content).trim();

  if (!normalized) {
    return [];
  }

  const lines = normalized.split("\n").filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split("\t").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split("\t");
    const row: TsvRow = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });

    return row;
  });
}

export function toNumber(value: string): number {
  if (value === "") {
    return 0;
  }

  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric value: "${value}"`);
  }

  return parsed;
}

export function toYesNo(value: string): "Oui" | "Non" {
  if (value === "Oui" || value === "Non") {
    return value;
  }

  if (value === "") {
    return "Non";
  }

  throw new Error(`Invalid YesNo value: "${value}"`);
}
