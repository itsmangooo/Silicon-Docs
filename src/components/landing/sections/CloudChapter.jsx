import React from 'react'
import Chapter, {EditorialStage, FactRail} from '../compositions/Chapter'
import ChapterLabel from '../core/ChapterLabel'
import MediaFrame from '../core/MediaFrame'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
export default function CloudChapter({content}) {
  return <Chapter id={content.id} tone="paper" className="cloud-chapter">
    <EditorialStage className="cloud-heading"><ChapterLabel>{content.label}</ChapterLabel><LineReveal variant="cascade" lines={content.title} id="aws-title" className="cloud-title" /><p className="lead">{content.description}</p></EditorialStage>
    <MediaFrame image={content.image} crop className="cloud-proof" />
    <EditorialStage><FactRail items={content.details} /><div className="cloud-footnote"><p className="small-note">{content.limitation}</p><Button variant="dark" href={content.link.href}>{content.link.label}</Button></div></EditorialStage>
  </Chapter>
}
