// Public claims and copied UI assets verified against this exact product release.
const repository = 'https://github.com/itsmangooo/Silicon'
const image = (name, height, alt) => ({src: `/img/screenshots/${name}.png`, width: 1440, height, alt: `${alt}; sanitized demo data`, caption: 'Actual Silicon UI · sanitized demo data'})
export const silicon = {
  name: 'Silicon', logo: '/img/silicon-mark-flat.svg', repository,
  release: 'v0.1.7', releaseCommit: '2ea960547db6e0d95a3d23ffab51b35010fd1f2f',
  description: 'Deploy applications on your Linux servers and manage supported AWS infrastructure in one self-hosted workspace. Built with Go, PostgreSQL, and explicit provider boundaries.',
  navigation: [{label: 'Product', href: '#product'}, {label: 'Documentation', href: '/docs/'}, {label: 'GitHub', href: repository}],
  chapterOrder: ['hero', 'product', 'servers', 'aws', 'network', 'architecture', 'security', 'install'],
  hero: {
    id: 'hero', label: 'Self-hosted infrastructure', title: ['Your', 'infrastructure.', 'One place.'],
    description: 'Your homelab. Your Linux servers. Your AWS resources. Bring them together in one self-hosted workspace.',
    image: image('dashboard', 1180, 'Silicon dashboard with applications, deployment history, and registered servers'),
  },
  product: {
    id: 'product', title: ['A commit.', 'A container.', 'A clear history.'],
    description: 'Deploy a Docker image or build a root Dockerfile from an exact GitHub revision. See what changed, where it runs, and how it got there.',
    image: image('deployments', 1000, 'Deployment table showing application names, exact revisions, timestamps, and real deployment states'),
    details: [['Exact source', 'Signed GitHub pushes and manual releases use the same deployment queue. Build the pushed SHA, not whatever the branch points to later.'], ['Visible progress', 'Inspect events, deployment history, container state, and runtime logs. Redeploy or roll back through the same runtime path.'], ['Explicit configuration', 'Keep environment variables and encrypted secrets separate. Publish a host port only when you choose to.']],
    link: {label: 'Follow your first deployment', href: '/docs/getting-started/first-deployment'},
  },
  servers: {
    id: 'servers', title: ['Keep the hardware.', 'Bring the overview.'],
    description: 'Connect a Linux host through verified SSH, or explicitly enable local Docker access. Your own machines remain normal deployment targets.',
    image: image('server-ssh-detail', 1000, 'SSH server detail with trusted host identity, connection checks, Docker availability, and application records'),
    details: [['Trust first', 'Review the host fingerprint. Check SSH and Docker before deploying.'], ['One runtime path', 'Typed operations reuse the Docker lifecycle for deployments, start/stop, inspection, and logs.']],
    link: {label: 'Connect your Linux server', href: '/docs/guides/self-hosted'},
  },
  aws: {
    id: 'aws', label: 'AWS / EC2', title: ['Your homelab', 'doesn’t end', 'at the cloud.'],
    description: 'Connect with AssumeRole. Discover, create, import, and manage EC2 machines alongside your own servers.',
    image: image('guide-aws-compute', 1200, 'AWS Compute inventory with EC2 instance ownership, lifecycle actions, and recent infrastructure operations'),
    details: [['Compute & infrastructure', 'EC2 lifecycle, VPCs, subnets, security groups, Elastic IPs, EBS, and snapshots.'], ['Costs with context', 'Delayed Cost Explorer data, on-demand estimates, and budgets that can block new provisioning.'], ['Deploy on the instance', 'Use SSH for Git builds, secrets, tunnels, and private networks. SSM provides bounded checks and lifecycle operations.']],
    limitation: 'Focused on EC2-hosted workloads. Silicon does not replace the full AWS Console or configure a complete VPC internet/NAT topology.',
    link: {label: 'Start with the AWS hosting guide', href: '/docs/guides/aws'},
  },
  network: {
    id: 'network', label: 'Private networking', title: ['Different machines.', 'A private connection.'],
    description: 'Attach selected applications to an organization-owned WireGuard network. Discover them through .internal names. Keep project boundaries explicit.',
    stages: [
      {label: 'Local', title: 'Start close to home.', text: 'Add a local Linux host to a Silicon Network. WireGuard private keys are generated on the host and stay there.'},
      {label: 'SSH', title: 'Bring your other servers.', text: 'Add verified SSH nodes. A reachable Linux hub joins the machines without exposing application ports publicly.'},
      {label: 'AWS', title: 'Reach into the cloud.', text: 'An EC2 instance connected over SSH participates in the same private IPv4 network.'},
      {label: 'Private network', title: 'Connect applications. Keep boundaries.', text: 'CoreDNS provides .internal discovery. nftables enforces same-project access and explicit same-organization cross-project rules.'},
    ],
    notes: ['Host-generated private keys stay on their servers.', 'Private IPv4 · hub-and-spoke · asynchronous reconciliation.'],
    limitation: 'A reachable hub is required. One attached application per network member today; no NAT traversal, direct-peer optimization, or high-availability hub.',
    link: {label: 'Understand private networking', href: '/docs/guides/private-networking'},
  },
  architecture: {
    id: 'architecture', label: 'Go + PostgreSQL', title: ['One application.', 'Replaceable providers.'],
    description: 'A Go modular monolith, not a collection of microservices. Core modules use explicit interfaces; adapters handle infrastructure-specific operations.',
    foundation: 'Go · PostgreSQL · persistent jobs · versioned REST API',
    providers: [['Runtime', 'Docker'], ['Server connections', 'Local · SSH · AWS SSM'], ['Git source', 'GitHub App'], ['DNS & tunnels', 'Cloudflare'], ['Cloud resources', 'AWS SDK'], ['Private networking', 'WireGuard · CoreDNS · nftables'], ['Secrets', 'Local AES-256-GCM'], ['System email', 'SMTP · Resend · Postmark · Mailgun · SES']],
    extensions: 'IdentityProvider and LogProvider are extension contracts. OIDC login and additional cloud/runtime adapters are not implemented.',
    link: {label: 'Explore the source architecture', href: '/docs/developers/architecture'},
  },
  security: {
    id: 'security', title: ['Concrete safeguards.', 'Visible responsibility.'],
    items: [['Organization boundaries', 'Backend-enforced permissions and tenant-scoped resource relationships. Membership roles apply separately in each organization.'], ['Credentials kept private', 'Argon2id passwords, HTTP-only server sessions, CSRF protection, and AES-256-GCM encryption for stored secrets and provider credentials.'], ['Changes you can inspect', 'Verified SSH identity, signed and deduplicated GitHub webhooks, ownership-safe provider operations, and recorded audit events.']],
    note: 'You operate the host, its network exposure, backups, and provider permissions. Silicon makes those responsibilities visible; it does not remove them.',
    link: {label: 'Read the security model', href: '/docs/security/overview'},
  },
  install: {
    id: 'install', title: ['Make it', 'yours.'],
    description: 'A Linux host. Docker and Compose. Your own Silicon installation, with PostgreSQL data kept on infrastructure you control.',
    command: 'curl -fsSL https://raw.githubusercontent.com/itsmangooo/Silicon/main/install.sh | sh',
    note: 'Prefer to inspect install.sh before running it. The default source is main; use --version v0.1.7 for this verified tagged release.',
    steps: ['Install Silicon', 'Open your workspace', 'Connect infrastructure', 'Deploy & manage'],
    link: {label: 'Installation guide', href: '/docs/getting-started/installation'},
  },
}
