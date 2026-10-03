# Silicon Documentation

This is the independent public documentation website for [Silicon](https://github.com/itsmangooo/Silicon). It is a static Docusaurus project: it does not import the Silicon frontend, call the Silicon API, require PostgreSQL, or require a running Silicon installation.

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
npm run docs:preview
```

## Add documentation

Create a normal Markdown file under `docs/`, for example:

```text
docs/guides/new-feature.md
```

Add its document ID to `sidebars.js`. JSX and MDX are not required for normal documentation.

## Static deployment

`.github/workflows/deploy.yml` builds and deploys `build/` to GitHub Pages. The default production path is `https://itsmangooo.github.io/Silicon-Docs/`.

For Cloudflare Pages configure:

- build command: `npm run docs:build`
- output directory: `build`
- Node.js: 22 or newer
- environment variable `DOCS_BASE_URL=/`
- environment variable `DOCS_URL=https://docs.example.com`

Replace `docs.example.com` with the real documentation hostname. No backend is required.
