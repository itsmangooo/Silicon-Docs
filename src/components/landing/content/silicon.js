// Public copy and assets are reviewed against this exact released product.
// Screenshots are the released React UI with isolated, sanitized demo fixtures.
export const silicon = {
  name: 'Silicon',
  logo: '/img/silicon-mark-flat.svg',
  repository: 'https://github.com/itsmangooo/Silicon',
  release: 'v0.1.7',
  releaseCommit: '2ea960547db6e0d95a3d23ffab51b35010fd1f2f',
  description: 'Deploy applications on your Linux servers and manage supported AWS infrastructure in one self-hosted workspace. Built with Go, PostgreSQL, and explicit provider boundaries.',
  navigation: [
    {label: 'Product', href: '#product'},
    {label: 'Docs', href: '/docs/'},
    {label: 'GitHub', href: 'https://github.com/itsmangooo/Silicon'},
  ],
  hero: {
    eyebrow: 'YOUR SERVERS. YOUR CLOUD. YOUR CALL.',
    title: ['Your infrastructure.', 'One place.'],
    description: 'Run your applications on infrastructure you control. Bring your Linux servers and supported AWS resources into the same workspace.',
    image: {src: '/img/screenshots/dashboard.png', width: 1440, height: 1180, alt: 'Silicon dashboard showing applications, deployment history, and registered servers using sanitized demo data'},
  },
  chapters: [
    {
      id: 'product', number: '01', label: 'APPLICATIONS & DEPLOYMENTS',
      title: 'From commit to\nrunning container.',
      description: 'Deploy a Docker image or build a root Dockerfile from an exact GitHub revision. Every deployment keeps its source, state changes, and history.',
      details: [
        ['A revision you can trace', 'Signed GitHub pushes enter the same deployment queue as manual releases. The pushed commit stays the build target.'],
        ['The detail that matters', 'Inspect deployment events, container state, and runtime logs. Keep variables and encrypted secrets separate.'],
      ],
      link: {label: 'Follow your first deployment', href: '/docs/getting-started/first-deployment'},
      image: {src: '/img/screenshots/deployments.png', width: 1440, height: 1000, alt: 'Silicon deployment table with application names, exact source revisions, timestamps, and deployment states; sanitized demo data'},
    },
    {
      id: 'servers', number: '02', label: 'YOUR SERVERS', reverse: true,
      title: 'Keep the hardware.\nBring the overview.',
      description: 'A homelab host, a rented Linux box, or an EC2 instance can be a deployment target. Connect through verified SSH, or explicitly enable local Docker access.',
      details: [
        ['Trust the host first', 'Review the SSH fingerprint, then check reachability and Docker availability before choosing a target.'],
        ['One runtime path', 'Remote deployments, lifecycle actions, and logs use the same Docker adapter through typed server operations.'],
      ],
      link: {label: 'Connect a self-hosted server', href: '/docs/guides/self-hosted'},
      image: {src: '/img/screenshots/server-ssh-detail.png', width: 1440, height: 1000, alt: 'SSH server detail with verified host identity, Docker status, connection checks, and runtime information; sanitized demo data'},
    },
  ],
  aws: {
    number: '03', label: 'AWS, IN THE SAME WORKSPACE',
    title: 'Your homelab doesn’t\nend at the cloud.',
    description: 'Connect an AWS account with AssumeRole. Discover, create, import, and manage EC2 machines alongside your own servers.',
    image: {src: '/img/screenshots/guide-aws-compute.png', width: 1440, height: 1200, alt: 'Silicon AWS Compute page showing an EC2 provisioning form and instance inventory with sanitized account and resource identifiers'},
    details: [
      ['Compute & infrastructure', 'EC2 lifecycle, VPCs, subnets, security groups, Elastic IPs, EBS, and snapshots.'],
      ['Costs with context', 'Delayed Cost Explorer data, on-demand estimates, and budgets that can block new provisioning.'],
      ['Deploy on the instance', 'Use SSH for Git builds, secrets, tunnels, and private networks. SSM provides bounded checks and lifecycle operations.'],
    ],
    limitation: 'Focused on EC2-hosted workloads. Silicon does not replace the full AWS Console or configure a complete VPC internet/NAT topology.',
    link: {label: 'Read the AWS hosting guide', href: '/docs/guides/aws'},
  },
  network: {
    number: '04', label: 'PRIVATE NETWORKING',
    title: 'Different machines.\nA private connection.',
    description: 'Attach selected applications to an organization-owned WireGuard network. Reach them through .internal names, with same-project access and explicit cross-project rules.',
    hub: {title: 'Reachable Linux hub', detail: 'WireGuard · CoreDNS · nftables'},
    nodes: [
      {title: 'Local host', subtitle: 'Local connection', service: 'api.production.home.internal'},
      {title: 'Your Linux server', subtitle: 'Verified SSH', service: 'worker.production.jobs.internal'},
      {title: 'AWS EC2', subtitle: 'SSH connection', service: 'backend.production.cloud.internal'},
    ],
    notes: ['Host-generated private keys stay on their servers.', 'Private IPv4 · hub-and-spoke · asynchronous reconciliation.'],
    limitation: 'A reachable hub is required. One attached application per network member today; no NAT traversal, direct-peer optimization, or high-availability hub.',
    link: {label: 'Understand private networking', href: '/docs/guides/private-networking'},
  },
  architecture: {
    number: '05', label: 'BUILT WITH BOUNDARIES',
    title: 'One application.\nReplaceable providers.',
    description: 'The Go backend is a modular monolith. Core modules depend on explicit interfaces; concrete providers handle infrastructure-specific operations.',
    foundation: 'Go modules · PostgreSQL · persistent jobs · versioned REST API',
    providers: [
      ['Runtime', 'Docker'], ['Connections', 'Local · SSH · AWS SSM'],
      ['Git source', 'GitHub App'], ['DNS & tunnels', 'Cloudflare'],
      ['Cloud resources', 'AWS SDK'], ['Private networks', 'WireGuard · CoreDNS · nftables'],
      ['Secrets', 'Local AES-256-GCM'], ['System email', 'SMTP · Resend · Postmark · Mailgun · SES'],
    ],
    extensions: 'IdentityProvider and LogProvider are extension contracts. OIDC login and additional cloud/runtime adapters are not implemented.',
    link: {label: 'Explore the source architecture', href: '/docs/developers/architecture'},
  },
  security: {
    number: '06', label: 'SECURITY & OWNERSHIP',
    title: 'Concrete safeguards.\nVisible responsibility.',
    items: [
      ['Organization boundaries', 'Backend-enforced permissions and tenant-scoped resource relationships.'],
      ['Credentials kept private', 'Argon2id passwords, HTTP-only server sessions, and encrypted secrets and provider credentials.'],
      ['Changes you can inspect', 'Verified SSH identity, signed webhooks, ownership checks, and recorded audit events.'],
    ],
    link: {label: 'Read the security model', href: '/docs/security/overview'},
  },
  install: {
    number: '07', label: 'START WITH YOUR OWN INSTALLATION',
    title: 'Make it yours.',
    description: 'Install on a Linux host with Docker and Compose. Keep the platform and its PostgreSQL data on infrastructure you control.',
    command: 'curl -fsSL https://raw.githubusercontent.com/itsmangooo/Silicon/main/install.sh | sh',
    note: 'Prefer to inspect install.sh before running it. The default source is main; use --version v0.1.7 for this verified tagged release.',
    steps: ['Install', 'Open Silicon', 'Add infrastructure', 'Deploy & manage'],
  },
}
