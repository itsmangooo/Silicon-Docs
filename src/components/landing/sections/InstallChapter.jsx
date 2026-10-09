import React, {useEffect, useRef, useState} from 'react'
import {m} from 'motion/react'
import {EditorialStage} from '../compositions/Chapter'
import Button from '../core/Button'
import ChoreographedChapter from '../motion/ChoreographedChapter'
export default function InstallChapter({content, repository}) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  const timeout = useRef(null)
  useEffect(() => () => clearTimeout(timeout.current), [])
  async function copy() {
    try {await navigator.clipboard.writeText(content.command); setCopied(true); setError(false); clearTimeout(timeout.current); timeout.current = setTimeout(() => setCopied(false), 2500)} catch {setError(true)}
  }
  return <ChoreographedChapter id={content.id} className="install-chapter">{motion => <EditorialStage>
    <div className="install-heading"><m.h2 {...motion.heading} id="install-title" className="chapter-reveal install-title">{content.title.map((line, index) => <React.Fragment key={line}><span>{line}</span>{index < content.title.length - 1 ? ' ' : null}</React.Fragment>)}</m.h2><m.p {...motion.supporting} className="chapter-reveal lead">{content.description}</m.p></div>
    <m.div {...motion.content} className="chapter-reveal install-details">
    <div className="install-command"><div className="command-heading"><span>LINUX · DOCKER + COMPOSE</span><button type="button" onClick={copy}>{copied ? 'Copied ✓' : 'Copy command'}</button></div><pre tabIndex="0" aria-label="Silicon installation command"><code>{content.command}</code></pre><span className="sr-only" role="status">{copied ? 'Command copied' : error ? 'Copy unavailable. Select the command to copy it.' : ''}</span></div>
    <p className="small-note install-note">{content.note}</p>
    <ol className="install-progression">{content.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
    <div className="install-actions"><Button variant="dark" href={content.link.href}>{content.link.label}</Button><Button variant="text" href={repository}>Explore on GitHub</Button></div>
    </m.div>
  </EditorialStage>}</ChoreographedChapter>
}
