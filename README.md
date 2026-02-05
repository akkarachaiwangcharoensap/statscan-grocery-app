<p align="center">
  <img src="public/logo192.png" width="64" alt="statscan-grocery-app logo" />
</p>

# Canadian Grocery Price Tracker

A small, accessible React + TypeScript application to explore and compare grocery prices using official Statistics Canada data. Browse categories, search products, and compare your local prices against national averages with built-in unit conversion and regional filtering.

[App](https://akkarachaiwangcharoensap.github.io/statscan-grocery-app)

---

## Features

- Browse product categories and unique product counts
- Accessible search with typeahead and keyboard navigation
- Compare local price to StatsCan averages (per unit) with percentage diff
- Unit conversion utilities (kg ↔ lb, L ↔ oz, etc.)
- Reproducible dataset: CSV → JSON processor included

> [!note]
> Data source: Statistics Canada. The repository contains a small Python script to convert the official CSV into the app's JSON dataset.

---

## Quick Start

Prerequisites: Node.js (LTS recommended), npm. For data processing: Python 3 and pandas (optional).

Clone and install:

```bash
git clone <repo-url>
cd statscan-grocery-app
npm ci
```

Run locally:

```bash
npm run dev
# then open http://localhost:3000
```

Build for production:

```bash
npm run build
```

---

## Data Processing

To regenerate the `public/data/grocery-data.json` from the raw CSV:

```bash
# (optional) create/activate Python venv
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# convert CSV -> public/data/grocery-data.json
python process_statscan_to_json.py data/statscan-full.csv public/data/grocery-data.json
```

> [!note]
> The app loads `public/data/grocery-data.json` at runtime — regenerate it if you update the CSV.

---

## Tests & Quality

Unit tests (Vitest):

```bash
# Run in watch
npm run test
# Run once (headless)
npm run test:run
# Coverage
npm run test:coverage
```

End-to-end tests (Playwright):

```bash
# Install browsers and run E2E
npx playwright install --with-deps
npm run e2e
```

Lint and type check:

```bash
npm run lint
npm run type-check
```

---

## CI / CD

This repository includes GitHub Actions workflows that run linting, type checks, unit tests, builds, and E2E tests. A deployment workflow publishes the `build/` output to GitHub Pages when changes are pushed to `main`.

> [!note]
> The Vite `base` is configured to deploy to `https://<user>.github.io/statscan-grocery-app/` when running in GitHub Actions (see `vite.config.ts`).

---

## Project Structure (high level)

- `public/` — static assets and `public/data/grocery-data.json`
- `src/` — React app (components, pages, hooks, utils)
- `tests/` — Playwright E2E tests
- `process_statscan_to_json.py` — CSV → JSON conversion

---

## Contributing

Contributions are welcome. Open an issue or a pull request and include tests for new behavior. Keep changes small and focused.

---

## Acknowledgements

- Statistics Canada — source data
- Built with Vite, React, TypeScript, Vitest, and Playwright