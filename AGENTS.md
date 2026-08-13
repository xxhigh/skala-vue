# Repository Guidelines

## Project Structure & Module Organization

This is a Vue 3 single-page weather practice application built with Vite. Application entry points are `src/main.js` and `src/App.vue`. Route definitions live in `src/router/index.js`; route-level screens belong in `src/views/` (for example, `WeatherHomeView.vue`). Reusable UI is organized in `src/components/`, with weather components in `src/components/Weather/` and directive examples in `src/components/practices/`. Pinia stores are in `src/stores/`. Put shared styles and static source assets in `src/assets/`; public files go in `public/`. Screenshots used by the README are in `images/`.

## Build, Lint, and Development Commands

- `npm install` installs the locked dependencies (Node `^20.19.0 || >=22.12.0`).
- `npm run dev` starts the Vite development server.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs both configured linters and applies their safe fixes.
- `npm run format` formats files below `src/` with Prettier.

Run `npm run build` and `npm run lint` before submitting changes.

## Coding Style & Naming Conventions

Use Vue Single-File Components with `<script setup>` and the Composition API, matching existing components. Follow Prettier formatting: two-space indentation, single quotes, and trailing commas where formatting adds them. Use PascalCase for component files (`WeatherCard.vue`), `*View.vue` for route screens, camelCase for functions and variables, and descriptive Pinia store names such as `useWeatherStore`. Keep component-specific styles in `<style scoped>`; place broadly shared CSS in `src/assets/`. Prefer the `@/` alias for imports from `src/`.

## Testing Guidelines

No automated test framework or coverage target is currently configured. For UI changes, verify the relevant route with `npm run dev`, including interactions such as navigation, weather-card selection, and unit toggling. If adding tests, introduce the framework and an `npm` script in the same change; name test files after the unit under test (for example, `WeatherCard.spec.js`).

## Commit & Pull Request Guidelines

Follow the existing Conventional Commit-style history: `feat: add temperature unit toggle` or `chore: update README`. Keep commits focused and write imperative, concise subjects. Pull requests should explain the user-visible change, link any relevant issue or assignment, list validation performed, and include screenshots for visual or layout changes. Do not commit generated `dist/` output or credentials.
