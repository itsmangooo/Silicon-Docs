/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/first-login',
        'getting-started/first-deployment',
        'getting-started/updating',
      ],
    },
    {
      type: 'category',
      label: 'Operator guides',
      items: [
        'guides/frontend-backend',
        'guides/self-hosted',
        'guides/aws',
        'guides/github',
        'guides/cloudflare',
        'guides/public-access',
        'guides/domains',
        'guides/configuration',
        'guides/costs-budgets',
        'guides/private-networking',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/organizations',
        'concepts/projects',
        'concepts/environments',
        'concepts/applications',
        'concepts/deployments',
        'concepts/servers',
        'concepts/networking',
      ],
    },
    {
      type: 'category',
      label: 'Developers',
      items: [
        'developers/source-setup',
        'developers/repository-structure',
        'developers/architecture',
        'developers/backend',
        'developers/frontend',
        'developers/database',
        'developers/migrations',
        'developers/providers',
        'developers/runtime',
        'developers/networking-internals',
        'developers/api',
        'developers/testing',
        'developers/releases',
        'developers/contributing',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/overview',
        'security/secrets',
        'security/ssh',
        'security/aws',
        'security/networking',
        'security/updater',
      ],
    },
  ],
}

export default sidebars
