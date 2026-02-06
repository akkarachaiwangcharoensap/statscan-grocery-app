![StatsCan Grocery App](public/android-chrome-192.png)

# StatsCan Grocery App

A small, accessible Progressive Web App (PWA) for exploring grocery price data published by Statistics Canada. Built with React, Vite and TypeScript — it processes the official CSV data into a compact JSON dataset and presents interactive product, category and location views.

---

## Installation

Prerequisites:
- Node.js (18+ recommended)
- Python 3.x (for data processing)

Install dependencies and run locally:

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Build for production and preview the production bundle:

```bash
npm run build
npm run preview
```

Process the original Statistics Canada CSV into the app's JSON format:

```bash
pip install -r requirements.txt
python process_statscan_to_json.py data/statscan-full.csv public/data/grocery-data.json
```

> [!note]
> The repo includes a sample dataset in `data/statscan-full.csv`. The processing script is `process_statscan_to_json.py` — read its docstring for options and behavior.

---

## Features

- Browse and search grocery products by name
- Filter by category and location
- Pricing and conversions (kg / L / unit)
- Accessible UI built with web-first locators and a11y considerations
- PWA support (offline-first caching via Workbox)

---

## Testing

Run unit tests and component tests with Vitest:

```bash
npm run test
npm run test:all
npm run test:ui   # interactive UI
npm run test:coverage
```

End-to-end tests use Playwright:

```bash
npm run e2e
npm run e2e:headed
```

For a full verification run (unit, e2e, lint, types):

```bash
npm run test:all
```

Playwright reports are saved under `playwright-report/` when tests run.

---

## Project structure (high level)

- `src/` — React app source (components, hooks, pages, utils)
- `public/` — static assets and PWA icons
- `data/` — raw CSV source data
- `tests/` — Playwright e2e specs
- `process_statscan_to_json.py` — CSV → JSON processor
- `build/` — production build output

---

## CI & Deployment

- The Vite config is set to detect GitHub Actions and use a repo subpath (`/statscan-grocery-app/`) when appropriate.
- The app is a static PWA and can be served from GitHub Pages, Netlify, Vercel, or any static host — just build and publish the `build/` directory.

> [!note]
> The repo contains a Playwright config that will spawn `npm start` for local testing. CI workflows should ensure `npm run build` and `npm start` are available before running e2e tests.

---

## Development notes & tips

- Use role- and label-based locators in tests for resilience and accessibility (see `.github/instructions/playwright-typescript.instructions.md`).
- Keep component tests focused and use `test.step()` for readability in e2e tests.
- `vite-plugin-pwa` is configured in `vite.config.ts` to include common icons and caching settings; adjust Workbox options if your static assets grow.

---

## Acknowledgements

This project consumes and republishes aggregated grocery price data published by Statistics Canada. See `process_statscan_to_json.py` for data transformation logic.