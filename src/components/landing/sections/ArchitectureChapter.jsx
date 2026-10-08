import React from 'react'
import Chapter, {EditorialStage} from '../compositions/Chapter'
import ChapterLabel from '../core/ChapterLabel'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
import {AssemblyGroup, AssemblyItem, AssemblyPath} from '../motion/Assemble'
export default function ArchitectureChapter({content}) {
  return <Chapter id={content.id} className="architecture-chapter"><EditorialStage>
    <div className="architecture-heading"><ChapterLabel>{content.label}</ChapterLabel><LineReveal lines={content.title} id="architecture-title" className="architecture-title" /><p className="lead">{content.description}</p></div>
    <AssemblyGroup className="architecture-schematic" data-diagram="provider-architecture">
      <svg viewBox="0 0 1000 640" className="architecture-paths" aria-hidden="true" fill="none">{content.providers.map((_, index) => {const left = index % 2 === 0; const y = 80 + Math.floor(index / 2) * 160; return <AssemblyPath key={index} index={index + 1} className="architecture-path" d={`M${left ? 240 : 760} ${y} H${left ? 350 : 650} V320 H500`} />})}</svg>
      <AssemblyItem index={0} className="architecture-core"><span className="core-label">MODULAR MONOLITH</span><h3>Silicon<br />Core</h3><p>{content.foundation}</p><span className="core-contract">Explicit provider interfaces</span></AssemblyItem>
      <dl className="provider-bus">{content.providers.map(([label, implementation], index) => <AssemblyItem index={index + 1} key={label} className="provider-node"><dt>{label}</dt><dd>{implementation}</dd></AssemblyItem>)}</dl>
      <p className="architecture-extensions"><span>Extension contracts, not implemented adapters</span>{content.extensions}</p>
    </AssemblyGroup>
    <Button variant="secondary" href={content.link.href}>{content.link.label}</Button>
  </EditorialStage></Chapter>
}
