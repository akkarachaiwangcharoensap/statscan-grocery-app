# Canadian Grocery Price Tracker

[![Build Status](https://img.shields.io/github/actions/workflow/status/statscan-grocery-app/statscan-grocery-app/ci.yml?style=flat-square&label=Build)](https://github.com/statscan-grocery-app/statscan-grocery-app/actions)
![Node version](https://img.shields.io/badge/Node.js->=20-3c873a?style=flat-square)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

If you like this project, star it on GitHub!

[Overview](#overview) • [Features](#features) • [Getting Started](#getting-started) • [Development](#development) • [Deployment](#deployment) • [Testing](#testing)

![Canadian Grocery Price Tracker App](public/grocery-app-logo.png)

A progressive web application that helps Canadians compare their grocery prices with official Statistics Canada data. Built with React, TypeScript, and Vite, this app provides real-time price comparisons across different provinces and cities.

## Overview

The Canadian Grocery Price Tracker transforms Statistics Canada's monthly grocery price data into an accessible, user-friendly interface. Whether you're trying to find the best deals, track price trends, or understand regional price variations, this app makes it easy to navigate Canada's grocery pricing landscape.

### Key Highlights

- **Official Data Source**: All pricing data comes directly from Statistics Canada's official grocery price surveys
- **Comprehensive Coverage**: Track prices across multiple Canadian provinces and cities
- **Product Categories**: Browse through organized categories including dairy, meat, produce, and more
- **Price Calculator**: Compare your actual grocery expenses with regional averages
- **Unit Conversion**: Intelligent conversion between different units (kg, g, L, mL)
- **Progressive Web App**: Install on your device for offline access and native app-like experience

## Features

### Price Comparison & Analysis
- Compare your grocery receipts with Statistics Canada averages
- Calculate potential savings or identify price premiums
- View percentage differences from regional averages
- Track price trends over time

### Search & Browse
- Search products by name with real-time filtering
- Browse by category with visual icons
- Filter by location (province and city)
- Sort by price, date, or product name

### Unit Conversion
- Automatic unit conversion (kg ↔ g, L ↔ mL)
- Per-unit pricing normalization
- Package size extraction and calculation
- Support for metric measurements

### Responsive Design
- Mobile-first, Apple-inspired interface
- Tailwind CSS for modern styling
- Font Awesome icons throughout
- Smooth animations and transitions
- Dark mode support (system preference)

### Developer-Friendly
- Full TypeScript type safety
- Comprehensive test coverage (Vitest + Playwright)
- Modern tooling (Vite, ESLint, Prettier)
- Component library architecture
- Custom React hooks

## Getting Started

There are multiple ways to get started with this project. The quickest way is to use [GitHub Codespaces](#use-github-codespaces) that provides a preconfigured environment. Alternatively, you can [set up your local environment](#use-your-local-environment) following the instructions below.

### Prerequisites

- **Node.js 20 or higher**: [Download Node.js](https://nodejs.org/en/download)
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Python 3.8+** (optional, for data processing): [Download Python](https://www.python.org/downloads/)

### Use GitHub Codespaces

You can run this project directly in your browser by using GitHub Codespaces, which will open a web-based VS Code:

[![Open in GitHub Codespaces](https://img.shields.io/static/v1?style=for-the-badge&label=GitHub+Codespaces&message=Open&color=blue&logo=github)](https://codespaces.new/YOUR-USERNAME/statscan-grocery-app?hide_repo_select=true&ref=main&quickstart=true)

### Use Your Local Environment

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/statscan-grocery-app.git
cd statscan-grocery-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

The app will automatically reload when you make changes to the source code.

## Development

### Project Structure

```
statscan-grocery-app/
├── public/                 # Static assets
│   ├── grocery-data.json  # Processed StatsCan data
│   └── categories/        # Category icons
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   └── types.ts          # TypeScript definitions
├── tests/                # End-to-end tests
├── scripts/              # Build and utility scripts
└── data/                 # Raw data files
```

### Available Scripts

#### Development
```bash
npm start                  # Start development server
npm run dev               # Alias for npm start
npm run build             # Build for production
npm run preview           # Preview production build locally
```

#### Testing
```bash
npm test                  # Run unit tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Generate coverage report
npm run e2e               # Run Playwright e2e tests
npm run e2e:ui            # Run e2e tests with UI
npm run test:all          # Run all tests + linting
```

#### Code Quality
```bash
npm run lint              # Lint TypeScript files
npm run type-check        # Check TypeScript types
```

#### Data Processing
```bash
python process_statscan_to_json.py data/statscan-full.csv public/grocery-data.json
```

### Data Processing Pipeline

The app includes a Python script that processes Statistics Canada's CSV data into an optimized JSON format:

1. **Product Name Cleaning**: Removes redundant information and normalizes names
2. **Unit Extraction**: Parses package sizes and per-unit pricing
3. **Category Inference**: Automatically categorizes products based on keywords
4. **Price Normalization**: Converts all prices to per-unit (per kg, per L, etc.)
5. **Location Parsing**: Extracts city and province information

To process new data:
```bash
pip install -r requirements.txt
python process_statscan_to_json.py data/statscan-full.csv public/grocery-data.json
```

## Deployment

### GitHub Pages

This project is configured for easy deployment to GitHub Pages:

1. Update the repository name in `vite.config.ts` if different from `/statscan-grocery-app/`
2. Build the project:
```bash
npm run build
```
3. Deploy to GitHub Pages using your preferred method

The app automatically handles the base path for GitHub Pages deployment.

### Other Platforms

The production build is a static site that can be deployed to any hosting platform:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **Azure Static Web Apps**: Use the Azure CLI
- **AWS S3 + CloudFront**: Upload the `dist` folder

Build settings:
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20+

## Testing

### Unit Tests

Unit tests are written with Vitest and React Testing Library:

```bash
npm test                  # Run all unit tests
npm run test:ui           # Open Vitest UI
npm run test:coverage     # Generate coverage report
```

Tests are located alongside the components they test (`*.test.tsx` files).

### End-to-End Tests

E2E tests use Playwright for browser automation:

```bash
npm run e2e               # Run in headless mode
npm run e2e:headed        # Run with browser visible
npm run e2e:ui            # Open Playwright UI
```

The test suite includes:
- Navigation and routing tests
- Product search and filtering
- Price calculator functionality
- Responsive design checks
- Accessibility tree validation

## Architecture

### Component Design

The app follows a component-based architecture with clear separation of concerns:

- **Pages**: Top-level route components (`HomePage`, `ProductsPage`, etc.)
- **Components**: Reusable UI components with isolated functionality
- **Hooks**: Custom React hooks for shared logic (`useGroceryData`, `useLocationPreference`)
- **Utils**: Pure functions for data transformation and formatting

### Performance Optimizations

- **Code Splitting**: Lazy-loaded routes reduce initial bundle size
- **Memoization**: `useMemo` prevents unnecessary recalculations
- **Virtual Lists**: Efficient rendering of large product lists
- **Service Worker**: PWA capabilities with offline support
- **Image Optimization**: Optimized icons and assets

## Data Source

All grocery price data comes from Statistics Canada's official Monthly Average Retail Prices survey. The data includes:

- 50+ common grocery items
- Multiple Canadian provinces and cities
- Monthly price updates
- Both package prices and per-unit pricing

> **Note**: Data is processed from Statistics Canada's public datasets. Ensure you have the appropriate license to use and distribute the data.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Resources

- [Statistics Canada - Monthly Average Retail Prices](https://www150.statcan.gc.ca/n1/en/subjects/agriculture_and_food/food/food_prices)

## Troubleshooting

### Data Not Loading

If the grocery data doesn't load:
1. Verify `public/grocery-data.json` exists
2. Check browser console for fetch errors
3. Ensure the file is properly formatted JSON
4. Check network tab for 404 errors

### Build Failures

If the build fails:
1. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check Node.js version: `node --version` (should be 20+)
4. Review error messages for missing dependencies

### Type Errors

If TypeScript reports errors:
1. Run `npm run type-check` to see all errors
2. Ensure all dependencies are installed
3. Check `tsconfig.json` for configuration issues
4. Restart your editor's TypeScript server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgments

- Statistics Canada for providing the grocery price data
- The React and TypeScript communities for excellent tooling
- All contributors who help improve this project
