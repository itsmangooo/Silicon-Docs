import React from 'react'
import Chapter, {EditorialStage, FactRail} from '../compositions/Chapter'
import MediaFrame from '../core/MediaFrame'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
import DeploymentFlow from '../graphics/DeploymentFlow'
export default function ProductChapter({content}) {
  return <Chapter id={content.id} tone="graphite" className="poster-chapter">
    <EditorialStage><LineReveal lines={content.title} id="product-title" className="poster-title" /><div className="deployment-composition"><DeploymentFlow /><p className="lead poster-lead">{content.description}</p></div></EditorialStage>
    <MediaFrame image={content.image} variant="horizontal" className="poster-proof"><aside className="media-callout glass-layer"><span>Exact revision</span><p>The source stays attached to the deployment history.</p></aside></MediaFrame>
    <EditorialStage><FactRail items={content.details} /><Button href={content.link.href}>{content.link.label}</Button></EditorialStage>
  </Chapter>
}
