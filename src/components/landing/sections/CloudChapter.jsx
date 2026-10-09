import React from 'react'
import {m} from 'motion/react'
import {EditorialStage, FactRail} from '../compositions/Chapter'
import MediaFrame from '../core/MediaFrame'
import Button from '../core/Button'
import PaperChapter from '../motion/PaperChapter'
export default function CloudChapter({content}) {
  return <PaperChapter id={content.id} className="chapter--paper cloud-chapter">
    {motion => <>
      <EditorialStage className="cloud-heading">
        <m.h2 {...motion.heading} id="aws-title" className="chapter-reveal cloud-title">{content.title.map((line, index) => <React.Fragment key={line}><span>{line}</span>{index < content.title.length - 1 ? ' ' : null}</React.Fragment>)}</m.h2>
        <m.p {...motion.supporting} className="chapter-reveal lead">{content.description}</m.p>
      </EditorialStage>
      <m.div {...motion.content} className="chapter-reveal cloud-details">
        <MediaFrame image={content.image} crop className="cloud-proof" />
        <EditorialStage><FactRail items={content.details} /><div className="cloud-footnote"><p className="small-note">{content.limitation}</p><Button variant="dark" href={content.link.href}>{content.link.label}</Button></div></EditorialStage>
      </m.div>
    </>}
  </PaperChapter>
}
