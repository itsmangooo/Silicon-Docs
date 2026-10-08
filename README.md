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

`src/pages/index.jsx` composes eight visual chapters. The reusable foundation lives under `src/components/landing/`: `core/` handles containers, links, navigation, and media; `compositions/` supplies visual arrangements; and `motion/` handles entrances and narrative progression. Landing styles in `src/css/landing/` are scoped to `.landing-root`, so documentation pages retain their existing navigation and themes.

Edit product copy, links, capabilities, chapter order, and screenshot metadata in `src/landing/silicon/content.mjs`. Brand choices are injected through `theme.mjs`, and conceptual diagram data lives in `diagrams.mjs`; the shared presentation primitives do not own Silicon-specific copy. Black, graphite, steel, and warm paper provide the chapter rhythm. Typography, borders, and neutral linework carry the identity. Navigation and callouts use solid surfaces; there is no glass treatment or backdrop blur. Chapter labels use names without section counters.

The release reference is **v0.1.7**, commit `2ea960547db6e0d95a3d23ffab51b35010fd1f2f`. Verify new claims against a tagged release before changing it. Screenshots are copied assets of the released interface with isolated demo fixtures, not production telemetry. Preserve their original colors, intrinsic dimensions, and descriptive alt text. The hero loads eagerly; chapter screenshots load lazily. Product images and the elements containing them remain static: no image reveal, masks, transforms, parallax, or zoom. Deployment flow, server transport, private networking, and provider diagrams explain the architecture; they must not imply live infrastructure status.

The provider architecture uses one pure coordinate model in `src/components/landing/graphics/provider-geometry.mjs` for both SVG node rectangles and exact edge-to-edge connector anchors. Smaller screens use a separate semantic HTML topology rather than a scaled-down desktop graphic. Solid nodes describe implemented adapters; dashed extension contracts remain below the graph and must not imply working integrations.

The reusable motion components use `motion/react` with `LazyMotion` and native scrolling. Motion belongs around the product proof: headline lines, supporting copy, separate chapter surfaces, structural borders, navigation, CTA details, and assembling diagrams. A moving section surface or frame must be an independent layer, never an ancestor that moves the screenshot with it. Shared settings centralize duration, easing, and discrete story-stage calculations. A manual motion toggle and the operating-system reduced-motion preference both provide a static presentation. The private-networking story activates only on desktop viewports at least 1100 pixels wide and 700 pixels high; smaller viewports and reduced-motion users see the complete final diagram. Keep content visible before hydration and preserve keyboard access during entrances. Poppins weights 400, 500, and 600 are self-hosted, avoiding third-party font requests.

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
