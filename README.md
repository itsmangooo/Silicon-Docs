# Silicon public website and documentation

This is the independent public website for [Silicon](https://github.com/itsmangooo/Silicon). The root is the product landing page; the Markdown documentation lives under `/docs/`. It is one static JavaScript/Docusaurus application and requires no Silicon installation or backend.

Current operator guides include installation-level [custom-domain access through Cloudflare Tunnel](docs/guides/public-access.md), [system email and password recovery](docs/guides/system-email.md), application DNS/Tunnel routing, GitHub deployment, self-hosted and AWS targets, private networking, safe updates, and security operations.

## Work locally

```sh
git clone https://github.com/itsmangooo/Silicon-Docs.git
cd Silicon-Docs
npm install
npm run docs:dev
```

Build and preview the production output:

```sh
npm run docs:build
npm test
npm run validate:build
npm run docs:preview
```

## Add documentation

Create a normal Markdown file under `docs/`, for example:

```text
docs/guides/new-feature.md
```

Add its document ID to `sidebars.js`. JSX and MDX are not required for normal documentation.

Previous documentation paths such as `/guides/self-hosted` redirect to `/docs/guides/self-hosted` in production. The root intentionally becomes the landing page, with the documentation index available at `/docs/`. Redirects are derived from generated routes, so new pages need no separate redirect list. Local search, Mermaid, themes, and sidebars remain Docusaurus features.

## Maintain the landing page

`src/pages/index.jsx` composes small chapters. Reusable layout/link/media primitives live in `src/components/landing/core/`, and `motion/` contains the reveal and diagram behavior. CSS variables in `src/css/landing/tokens.css` define the visual and motion language; landing styles are scoped so documentation pages keep their own navigation and themes.

Edit product copy, links, capabilities, and screenshot metadata in `src/components/landing/content/silicon.js`. Its release reference is **v0.1.7**, commit `2ea960547db6e0d95a3d23ffab51b35010fd1f2f`. Verify new claims against a tagged release before updating that reference. Existing screenshots are copied assets of the real released interface with isolated demo fixtures, not production telemetry. Keep intrinsic dimensions and descriptive alt text. The hero loads eagerly; chapter screenshots load lazily.

The reusable motion components use `motion/react` with `LazyMotion`, native scrolling, and CSS-defined durations/easing. Reveals occur once; mobile uses smaller travel and reduced-motion users see final diagram states without transforms. There are no continuous animations or scroll-linked loops. A self-hosted Inter variable font avoids a third-party font request.

Before shipping, run the checks above and review the landing at 375, 390, 430, 768, 1024, 1440, and 1920 pixels. Check keyboard focus, mobile menu/Escape behavior, reduced motion, image loading, and a legacy docs link. `validate:build` checks generated local links/assets, documentation redirects, and deployment prefixes. To validate root hosting, use `DOCS_BASE_URL=/ npm run docs:build` followed by `DOCS_BASE_URL=/ npm run validate:build` (set the environment variable using your shell's syntax).

## Static deployment

`.github/workflows/deploy.yml` builds and deploys `build/` to GitHub Pages. The default production path is `https://itsmangooo.github.io/Silicon-Docs/`.

For Cloudflare Pages configure:

- build command: `npm run docs:build`
- output directory: `build`
- Node.js: 22 or newer
- environment variable `DOCS_BASE_URL=/`
- environment variable `DOCS_URL=https://docs.example.com`

Replace `docs.example.com` with the real documentation hostname. No backend is required.
