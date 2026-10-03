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
