import React, {useEffect, useRef, useState} from 'react'
import Chapter, {EditorialStage} from '../compositions/Chapter'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
export default function InstallChapter({content, repository}) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  const timeout = useRef(null)
  useEffect(() => () => clearTimeout(timeout.current), [])
  async function copy() {
    try {await navigator.clipboard.writeText(content.command); setCopied(true); setError(false); clearTimeout(timeout.current); timeout.current = setTimeout(() => setCopied(false), 2500)} catch {setError(true)}
  }
  return <Chapter id={content.id} tone="emerald" className="install-chapter"><EditorialStage>
    <div className="install-heading"><LineReveal lines={content.title} id="install-title" className="install-title" /><p className="lead">{content.description}</p></div>
    <div className="install-command"><div className="command-heading"><span>LINUX · DOCKER + COMPOSE</span><button type="button" onClick={copy}>{copied ? 'Copied ✓' : 'Copy command'}</button></div><pre tabIndex="0" aria-label="Silicon installation command"><code>{content.command}</code></pre><span className="sr-only" role="status">{copied ? 'Command copied' : error ? 'Copy unavailable. Select the command to copy it.' : ''}</span></div>
    <p className="small-note install-note">{content.note}</p>
    <ol className="install-progression">{content.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol>
    <div className="install-actions"><Button href={content.link.href}>{content.link.label}</Button><Button variant="text" href={repository}>Explore on GitHub</Button></div>
  </EditorialStage></Chapter>
}
