import {themes as prismThemes} from 'prism-react-renderer'

const baseUrl = process.env.DOCS_BASE_URL || '/Silicon-Docs/'
const siteUrl = process.env.DOCS_URL || 'https://itsmangooo.github.io'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Silicon Documentation',
  tagline: 'Operate, understand, and contribute to Silicon',
  favicon: 'img/silicon-mark.svg',
  url: siteUrl,
  baseUrl,
  organizationName: 'itsmangooo',
  projectName: 'Silicon-Docs',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
    [
      '@cmfcmf/docusaurus-search-local',
      {
        indexDocs: true,
        indexPages: false,
        indexBlog: false,
        indexDocSidebarParentCategories: 2,
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          breadcrumbs: true,
          editUrl: 'https://github.com/itsmangooo/Silicon-Docs/edit/main/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      },
    ],
  ],
  themeConfig: {
    image: 'img/silicon-social-card.svg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Silicon Docs',
      logo: {alt: 'Silicon', src: 'img/silicon-mark.svg'},
      items: [
        {to: '/getting-started/installation', label: 'Get started', position: 'left'},
        {to: '/guides/self-hosted', label: 'Operator guides', position: 'left'},
        {to: '/developers/source-setup', label: 'Developers', position: 'left'},
        {to: '/security/overview', label: 'Security', position: 'left'},
        {href: 'https://github.com/itsmangooo/Silicon', label: 'Silicon on GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Use Silicon',
          items: [
            {label: 'Installation', to: '/getting-started/installation'},
            {label: 'First deployment', to: '/getting-started/first-deployment'},
            {label: 'Private networking', to: '/guides/private-networking'},
          ],
        },
        {
          title: 'Develop Silicon',
          items: [
            {label: 'Source setup', to: '/developers/source-setup'},
            {label: 'Architecture', to: '/developers/architecture'},
            {label: 'Contributing', to: '/developers/contributing'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'GitHub', href: 'https://github.com/itsmangooo/Silicon'},
            {label: 'Releases', href: 'https://github.com/itsmangooo/Silicon/releases'},
            {label: 'Security', to: '/security/overview'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Silicon contributors.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'go', 'json', 'yaml', 'docker'],
    },
  },
}

export default config
