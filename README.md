# Canadian Grocery Price Tracker

A small, accessible React app to explore and compare grocery prices using official Statistics Canada data. Browse categories, search products, and compare your local prices against the national dataset with unit conversion and regional filtering.

[Demo →](https://akkarachaiwangcharoensap.github.io/statscan-grocery-app)

---

## Key Features ✅

- Browse product categories and see unique product counts
- Search products with an accessible search UI
- Compare your price to Statistics Canada averages by year and region
- Unit conversion (e.g., kg ↔ lb, L ↔ oz) for easy comparison
- Data produced from a CSV → JSON processor for reproducible datasets

> [!note]
> Data source: Statistics Canada (processed locally with the included script).

---

## Quick start

Prerequisites:

- Node.js (LTS recommended) and npm
- Python 3 and pandas (for data processing, optional)

Install and run locally:

```bash
npm install
npm start
```

Open http://localhost:3000 to view the app.

**Developer note** 🔧

- This repo uses the `@` import alias to reference modules inside `src/` (e.g. `@/components/ProductSearch`). The alias is mapped in `tsconfig.json` (`"@/*": ["src/*"]`) and resolved at build time via `craco` (see `craco.config.js`).
- Scripts were updated to use `craco` (e.g. `npm start` now runs `craco start`). You can continue using the same commands (`npm start`, `npm test`, `npm run build`).


---

## Processing the Statistics Canada data

This repo includes a small Python utility to convert the original CSV to the JSON used by the app.

```bash
# create a Python venv (optional)
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# convert CSV -> public/data/grocery-data.json
python process_statscan_to_json.py data/statscan-full.csv public/data/grocery-data.json
```

> [!note]
> The app reads `public/data/grocery-data.json` at runtime — regenerate it if you need newer data or custom CSV files.

---

## Build & deploy

This project is configured to deploy to GitHub Pages.

```bash
npm run build
npm run deploy
```

(Deploy uses `gh-pages` and the `homepage` value in package metadata.)

---

## Tests

Run unit tests using the built-in test runner:

```bash
npm test
```

There are unit tests for utility functions (e.g., unit conversion) and component tests.

> [!note]
> Playwright-style test guidance is included in `.github/instructions/playwright-typescript.instructions.md` — follow those conventions when adding end-to-end tests.

---

## Project structure (high level)

- `public/` – static assets and `public/data/grocery-data.json`
- `src/` – React app
  - `pages/` – route pages (Home, Products, Product detail)
  - `components/` – UI components and helpers
  - `hooks/` – data fetching and shared hooks
  - `utils/` – conversion, formatting, and helper utilities
- `process_statscan_to_json.py` – CSV → JSON processor (pandas)
- `requirements.txt` – Python dependencies for data processing

---

## Contributing & Notes

Contributions are welcome: open issues or PRs for bug fixes, improvements, or updated datasets. Keep changes small and include tests where appropriate.

> [!warning]
> This project uses Statistics Canada data. Make sure you understand and comply with the dataset's terms if you redistribute processed data.

---

## Acknowledgements

- Statistics Canada — original grocery price CSV data
- Built with React + TypeScript

---

If you'd like, I can also add a short developer guide with common debug workflows, test examples, or CI deploy hints. Let me know which you'd prefer next. ✨
