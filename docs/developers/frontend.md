# Frontend

The panel is React 19, React Router, Vite, and JavaScript. TypeScript is intentionally not used. The main locations are:

- `frontend/src/App.jsx`: authenticated route table;
- `frontend/src/pages/`: route-level pages and workspaces;
- `frontend/src/components/`: shell, navigation, search, branding, and reusable UI;
- `frontend/src/state/`: authentication and active-organization state;
- `frontend/src/lib/api.js`: credentialed REST client;
- `frontend/src/styles.css`: centralized Silicon tokens and responsive styles;
- `frontend/src/docs/`: explicit in-panel Markdown catalog/registry;
- `frontend/src/preview/fixtures.js`: sanitized screenshot fixtures only.

## Add a page

1. Implement semantic JSX in `src/pages/` using existing primitives.
2. Register the route in `App.jsx`.
3. Add navigation/search entries only when the page should be discoverable.
4. Load organization data through `WorkspaceContext`/the API and clear it on tenant changes.
5. Add focused Vitest/Testing Library coverage.
6. Run lint, tests, and production build.
7. If the UI changed materially, refresh sanitized previews with `npm run preview:capture`.

The UI never substitutes for backend authorization. Avoid fabricated operational values, hidden unavailable targets, uncontrolled HTML, or credentials in fixtures.

## Appearance implementation

- `frontend/src/lib/theme.js` defines built-in style IDs, semantic tokens, default effects, and palette checks. `theme.css`, `presets.css`, `theme-system.css`, and `appearance-systems.css` contain component and layout rules. Dashboard layout variants share the same data and actions.
- `AppearanceContext.jsx` reads authenticated preferences from `GET /api/v1/account` and sets style, color mode, density, and layout on the document. The backend owns the saved account state.
- `AppearanceSettings.jsx` holds a local draft. `ThemePreview.jsx` renders shared panel primitives using that draft. `SurfaceStyles.jsx` applies the allowlisted rules from `lib/surfaces.js` to either the live panel or the preview. Widget overrides extend the widget category. `BackgroundLayer.jsx` handles decoration behind the shell and pauses animations on hidden tabs or reduced motion.
- `ColorPicker.jsx` edits color in a portal. `lib/color.js` owns HEX, RGB, HSV, and alpha conversions. Color and surface alpha apply to fills, while text and icons retain their own opacity.
- `lib/theme-file.js` validates version 3 JSON. It accepts typed tokens and settings. `backend/internal/httpapi/appearance.go` validates saved preferences, and `backend/internal/store/account.go` stores them with the optional normalized background in the user row. Backgrounds remain private to the account.
- Migration `000018_appearance_systems` maps Industrial to Flat UI and Terminal to Obsidian in both the active style and named presets. The earlier Liquid Metal migration maps that style to Soft UI.
