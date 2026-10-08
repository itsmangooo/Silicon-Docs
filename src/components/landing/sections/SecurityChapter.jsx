import React from 'react'
import Chapter, {EditorialStage} from '../compositions/Chapter'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
export default function SecurityChapter({content}) {
  return <Chapter id={content.id} className="security-chapter"><EditorialStage className="security-composition">
    <div className="security-statement"><LineReveal lines={content.title} id="security-title" className="security-title" /><p className="small-note">{content.note}</p><Button variant="secondary" href={content.link.href}>{content.link.label}</Button></div>
    <dl className="security-mechanisms">{content.items.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
  </EditorialStage></Chapter>
}
