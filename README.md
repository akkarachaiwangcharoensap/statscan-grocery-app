<p align="center">
  <img src="public/grocery-app-logo.png" width="86" alt="statscan-grocery-app logo" />
</p>

# Canadian Grocery Price Tracker

Lightweight, accessible React + TypeScript app for exploring and comparing grocery prices using Statistics Canada data. Use it to browse categories, search products with accessible typeahead, and compare local prices against national averages (with built-in unit conversions).

**Live demo:** https://akkarachaiwangcharoensap.github.io/statscan-grocery-app

---

## Key Features

- Accessible product search with keyboard navigation and typeahead
- Compare prices per unit against official StatsCan averages (percentage differences)
- Unit conversion helpers (kg ↔ lb, L ↔ oz, etc.) and a simple price calculator
- Reproducible dataset pipeline: CSV → JSON (Python script included)
- Unit tests (Vitest) and E2E tests (Playwright)

> [!tip]
> Focus on accessibility: components use role-based locators and ARIA attributes to improve keyboard and screen reader experiences.

---

## Quick Start

Prerequisites: Node.js (LTS recommended) and npm. Optional: Python 3 + pandas to regenerate the dataset.

1. Clone and install dependencies

```bash
git clone <repo-url>
cd statscan-grocery-app
npm ci
```

2. Start the dev server

```bash
npm run dev
# Open http://localhost:3000
```

3. Build for production

```bash
npm run build
```

---

## Data: Regenerate the dataset

The app consumes `public/data/grocery-data.json`. To recreate it from the raw CSV:

```bash
# optional: create a venv
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# convert CSV -> JSON
python process_statscan_to_json.py data/statscan-full.csv public/data/grocery-data.json
```

> [!note]
> The repository includes `process_statscan_to_json.py` and `requirements.txt` (pandas).

---

## Tests & Quality

Unit tests (Vitest):

```bash
npm run test       # watch
npm run test:run   # single run
npm run test:coverage
```

End-to-end (Playwright):

```bash
npx playwright install --with-deps
npm run e2e
# or run headed for debugging
npm run e2e:headed
```

Linting & type checks:

```bash
npm run lint
npm run type-check
```

---

## CI & Deployment

GitHub Actions run linting, type checks, unit tests, and Playwright E2E. A deploy workflow publishes the `build/` output to GitHub Pages for the `main` branch.

> [!note]
> `vite.config.ts` sets `base` to `/statscan-grocery-app/` when running in CI to support Pages deployment.

---

## Project Layout

- `public/` — static assets and `public/data/grocery-data.json`
- `src/` — React app (components, pages, hooks, utils)
  - `components/` — reusable UI pieces
  - `pages/` — route-based pages (Home, Products, ProductDetail)
  - `hooks/`, `utils/` — small helpers and utilities
- `tests/` — Playwright E2E tests
- `process_statscan_to_json.py` — CSV → JSON conversion script

---

## Developing & Contributing

- Keep changes small and well-scoped. Add tests for new behavior.
- Tests follow Playwright best practices (role-based locators, auto-retrying assertions). See `.github/instructions/playwright-typescript.instructions.md` for guidelines.

---

## Built with

Vite, React, TypeScript, Vitest, Playwright, and pandas (for data processing)

---

## Acknowledgements

- Statistics Canada — source data
- Thanks to the open-source community for the libraries used here
