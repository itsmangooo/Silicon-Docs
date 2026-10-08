import React from 'react'
import Chapter, {CurvedStage, FactRail} from '../compositions/Chapter'
import MediaFrame from '../core/MediaFrame'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
import ServerTransport from '../graphics/ServerTransport'
export default function ServersChapter({content}) {
  return <Chapter id={content.id} className="servers-chapter"><CurvedStage className="servers-frame">
    <div className="servers-heading"><LineReveal lines={content.title} id="servers-title" className="servers-title" /></div>
    <MediaFrame image={content.image} className="servers-proof" />
    <div className="servers-copy"><ServerTransport /><p className="lead">{content.description}</p><FactRail items={content.details} /><Button variant="secondary" href={content.link.href}>{content.link.label}</Button></div>
  </CurvedStage></Chapter>
}
