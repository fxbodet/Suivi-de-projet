export interface KeyValueItem {
  label: string;
  value: string | number;
}

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => string;
}

export type BadgeTone = "ok" | "warn" | "ko" | "neutral";

export interface LinkOptions {
  label?: string;
  newTab?: boolean;
  className?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function renderAttributes(attributes: Record<string, string | undefined>): string {
  return Object.entries(attributes)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([key, value]) => ` ${key}="${escapeHtml(value as string)}"`)
    .join("");
}

export function renderCard(title: string, content: string): string {
  return `
    <div class="card">
      <h2>${escapeHtml(title)}</h2>
      ${content}
    </div>
  `;
}

export function renderSection(title: string, content: string): string {
  return `
    <section class="section">
      <h2>${escapeHtml(title)}</h2>
      ${content}
    </section>
  `;
}

export function renderMetric(label: string, value: string | number): string {
  return `<div class="metric"><strong>${escapeHtml(label)} :</strong> ${escapeHtml(normalizeValue(value))}</div>`;
}

export function renderKeyValueList(items: KeyValueItem[]): string {
  return items.map((item) => renderMetric(item.label, item.value)).join("\n");
}

export function renderBadge(label: string, tone: BadgeTone = "neutral"): string {
  const toneClassMap: Record<BadgeTone, string> = {
    ok: "badge-ok",
    warn: "badge-warn",
    ko: "badge-ko",
    neutral: "badge-neutral",
  };

  return `<span class="${toneClassMap[tone]}">${escapeHtml(label)}</span>`;
}

export function renderLink(href: string, options?: LinkOptions): string {
  const safeHref = href.trim();
  const label = options?.label?.trim() || safeHref;
  const className = options?.className?.trim();
  const newTab = options?.newTab ?? false;

  const attributes = renderAttributes({
    href: safeHref,
    class: className,
    target: newTab ? "_blank" : undefined,
    rel: newTab ? "noreferrer noopener" : undefined,
  });

  return `<a${attributes}>${escapeHtml(label)}</a>`;
}

export function renderList(items: string[], emptyMessage = "Aucune donnée."): string {
  if (items.length === 0) {
    return `<ul class="list"><li>${escapeHtml(emptyMessage)}</li></ul>`;
  }

  const rows = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `<ul class="list">${rows}</ul>`;
}

export function renderHtmlList(items: string[], emptyMessage = "Aucune donnée."): string {
  if (items.length === 0) {
    return `<ul class="list"><li>${escapeHtml(emptyMessage)}</li></ul>`;
  }

  return `<ul class="list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

export function renderTable<T extends Record<string, unknown>>(
  columns: TableColumn<T>[],
  rows: T[],
  emptyMessage = "Aucune donnée."
): string {
  if (rows.length === 0) {
    return `<p>${escapeHtml(emptyMessage)}</p>`;
  }

  const headers = columns.map((column) => `<th>${escapeHtml(column.header)}</th>`).join("");

  const body = rows
    .map((row) => {
      const cells = columns
        .map((column) => {
          const rawValue = row[column.key];
          const rendered = column.render
            ? column.render(rawValue, row)
            : escapeHtml(normalizeValue(rawValue as string | number | null | undefined));

          return `<td>${rendered}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <table class="table">
      <thead>
        <tr>${headers}</tr>
      </thead>
      <tbody>${body}</tbody>
    </table>
  `;
}
