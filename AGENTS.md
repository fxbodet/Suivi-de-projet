# AGENTS.md

## Project Overview

**Suivi-de-projet** is a construction project management tool written in TypeScript. It reads structured project data from TSV files, validates business rules, and generates HTML dashboards, CSV exports, and JSON summaries. The project is focused on the French construction industry domain (MOP phases, lots, DQE, CCTP, CCAP, etc.).

## Tech Stack

- **Language**: TypeScript (strict mode, ES2022 target)
- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Runner**: `tsx` for executing TypeScript directly
- **Package manager**: npm
- **No framework** — pure Node.js scripts generating static HTML/CSS output

## Repository Structure

```
├── config/              # Application parameters (parametres.json)
│   └── parametres.json  # Allowed statuses, priorities, MOP phases, VAT rates
├── data/                # TSV source data files (project, lots, planning, etc.)
├── docs/                # Business documentation
│   ├── regles-de-gestion.md   # Business rules reference
│   ├── schema-donnees.md      # Data schema documentation
│   └── plan-migration.md      # Migration plan
├── output/              # Generated HTML/CSS output files
├── src/
│   ├── domain/          # TypeScript type definitions (types.ts)
│   ├── import/          # TSV parsing and data loading
│   │   ├── parseTsv.ts         # Generic TSV parser with helpers (toNumber, toYesNo)
│   │   └── loadProjectData.ts  # Loads all TSV files into typed ProjectDataBundle
│   ├── validation/      # Data validation rules
│   │   ├── index.ts             # Aggregates all validators
│   │   ├── validateRelations.ts # Foreign key integrity checks
│   │   ├── validateFinance.ts   # Financial consistency checks
│   │   ├── validatePlanning.ts  # Planning date consistency
│   │   ├── validateDuplicates.ts # Unique ID checks
│   │   └── validateEnums.ts     # Enum value validation
│   ├── services/        # High-level project context service
│   ├── reporting/       # Project summary generation
│   ├── ui/              # View rendering (dashboard, lots, validation)
│   └── scripts/         # Entry-point scripts for each export task
├── package.json
└── tsconfig.json
```

## Build & Run Commands

```bash
# Install dependencies
npm install

# Build all HTML pages
npm run build

# Build everything (HTML + CSV + JSON exports)
npm run build:all

# Build and display instructions
npm run start

# Individual exports
npm run export:dashboard-html
npm run export:lots-html
npm run export:validation-html
npm run export:intervenants-html
npm run export:actions-html
npm run export:documents-html
npm run export:finances-html
npm run export:index-html
npm run export:lots-csv
npm run export:validation-csv
npm run export:intervenants-csv
npm run export:actions-csv
npm run export:documents-csv
npm run export:summary           # JSON summary
npm run export:validation        # JSON validation report

# Data checking scripts (console output)
npm run check:data
npm run summary:data
npm run dashboard:data
npm run lots:data
npm run validation:data
```

There is no test suite, linter, or CI/CD pipeline configured.

## Coding Conventions

- **Language**: All source code is in TypeScript with strict mode enabled.
- **Module system**: ES modules (`import`/`export`), `"module": "NodeNext"` resolution.
- **Naming**: Domain types use PascalCase (e.g., `ProjectDataBundle`, `LigneDqe`). TSV column names use `Snake_Case` with initial capitals (e.g., `Montant_Marche_HT`).
- **Data format**: Business data is stored in TSV files under `data/`. Dates use `YYYY-MM-DD` format. Numeric fields use `.` as decimal separator. Boolean-like fields use `"Oui"` / `"Non"`.
- **No comments**: The codebase has minimal inline comments; code is self-documenting.
- **No external dependencies**: Only `tsx` and `typescript` as dev dependencies. No runtime dependencies.
- **Output**: Generated files go to `output/`. HTML pages share `output/styles.css`.

## Domain Context

This project manages construction project data following French MOP (Maîtrise d'Ouvrage Publique) methodology:

- **Phases MOP**: ESQ → APS → APD → PRO → ACT → VISA → DET → AOR
- **Lots**: Construction work packages with contracts, budgets, and progress tracking
- **DQE**: Detailed cost estimates (Détail Quantitatif Estimatif)
- **CCTP/CCAP**: Technical and administrative contract clauses
- **Situations**: Periodic progress billing
- **Intervenants**: Project stakeholders (MOA, MOE, contractors, etc.)
- **Suivi financier**: Financial tracking per lot

Allowed enum values for statuses, priorities, task types, MOP phases, and VAT rates are defined in `config/parametres.json`.

## Key Architecture Patterns

1. **Data pipeline**: TSV files → `parseTsv()` → typed objects (`loadProjectData()`) → validation → rendering/export
2. **Central data bundle**: `ProjectDataBundle` (in `src/domain/types.ts`) aggregates all 16 entity arrays and is the primary data structure passed around.
3. **Validation**: The `validateProjectData()` function runs all validators (relations, finance, planning, duplicates, enums) and returns a `ValidationReport` with issues, counts, and an `isValid` flag.
4. **Script pattern**: Each `src/scripts/export*.ts` file is a standalone entry point that loads data, processes it, and writes output to `output/`.

## Important Guidelines

- **TSV data files** under `data/` contain real project data — do not delete or overwrite them without intent.
- **Business rules** are documented in `docs/regles-de-gestion.md` — consult it for validation logic.
- **Data schema** is documented in `docs/schema-donnees.md` — consult it for entity relationships and column definitions.
- **Type definitions** in `src/domain/types.ts` must stay in sync with TSV column headers.
- **Configuration** in `config/parametres.json` defines the allowed enum values used by validators.
- All generated output goes to `output/` and should not be committed as source of truth.
