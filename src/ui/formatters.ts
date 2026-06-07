function repeat(char: string, count: number): string {
  return char.repeat(Math.max(0, count));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function pad(value: string | number, length: number): string {
  const text = String(value ?? "");
  return text.length >= length ? text : text.padEnd(length, " ");
}

export function section(title: string): string[] {
  return ["", `=== ${title} ===`];
}

export function divider(length = 72, char = "-"): string {
  return repeat(char, length);
}
