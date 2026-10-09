import React from 'react'
import Chapter, {EditorialStage} from '../compositions/Chapter'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
import ProviderSystem from '../graphics/ProviderSystem'
export default function ArchitectureChapter({content}) {
  return <Chapter id={content.id} className="architecture-chapter"><EditorialStage>
    <div className="architecture-heading"><LineReveal variant="quiet" lines={content.title} id="architecture-title" className="architecture-title" /><p className="lead">{content.description}</p></div>
    <ProviderSystem providers={content.providers} coreLabel="Silicon Core" coreDetail="Go modular monolith"
      implementedSummary="Docker · Local/SSH/AWS SSM · GitHub App · AWS · Cloudflare · WireGuard · AES-256-GCM · mail adapters"
      extensionContracts={['IdentityProvider', 'LogProvider']} contractNote="Contracts only. OIDC login and additional cloud/runtime adapters are not implemented." />
    <Button variant="secondary" href={content.link.href}>{content.link.label}</Button>
  </EditorialStage></Chapter>
}
