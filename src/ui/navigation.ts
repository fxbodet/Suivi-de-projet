export type DashboardNavigationPage =
  | "accueil"
  | "dashboard"
  | "lots"
  | "validation"
  | "intervenants"
  | "actions"
  | "documents"
  | "finances";

interface NavigationLink {
  key: DashboardNavigationPage;
  href: string;
  label: string;
}

const DASHBOARD_NAVIGATION_LINKS: NavigationLink[] = [
  { key: "accueil", href: "./index.html", label: "Accueil" },
  { key: "dashboard", href: "./dashboard.html", label: "Dashboard" },
  { key: "lots", href: "./lots.html", label: "Lots" },
  { key: "validation", href: "./validation.html", label: "Validation" },
  { key: "intervenants", href: "./intervenants.html", label: "Intervenants" },
  { key: "actions", href: "./actions.html", label: "Actions" },
  { key: "documents", href: "./documents.html", label: "Documents" },
  { key: "finances", href: "./finances.html", label: "Finances" },
];

export function renderDashboardNavigation(activePage?: DashboardNavigationPage): string {
  const links = DASHBOARD_NAVIGATION_LINKS.map((link) => {
    const attributes = [`href="${link.href}"`];
    if (link.key === activePage) {
      attributes.push('class="is-active"');
    }

    return `      <a ${attributes.join(" ")}>${link.label}</a>`;
  }).join("\n");

  return `<nav class="nav" aria-label="Navigation principale">
${links}
</nav>`;
}
