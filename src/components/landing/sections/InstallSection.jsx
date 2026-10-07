import React, {useState} from 'react'
import LandingSection from '../core/LandingSection'
import SectionHeader from '../core/SectionHeader'
import CTA from '../core/CTA'
import Reveal from '../motion/Reveal'

export default function InstallSection({content}) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  async function copy() {
    try {await navigator.clipboard.writeText(content.command); setCopied(true); setCopyError(false)}
    catch {setCopyError(true)}
  }
  return <LandingSection id="install" className="install-chapter">
    <Reveal><SectionHeader id="install" {...content} /></Reveal>
    <Reveal className="install-command">
      <div className="command-label"><span>LINUX / DOCKER + COMPOSE</span><button onClick={copy}>{copied ? 'Copied' : 'Copy command'}</button></div>
      <pre tabIndex="0" aria-label="Silicon installation command"><code>{content.command}</code></pre>
      <p role="status" aria-live="polite" className="copy-status">{copyError ? 'Copy unavailable. Select the command to copy it manually.' : copied ? 'Installation command copied.' : ''}</p>
    </Reveal>
    <div className="install-support"><p>{content.note}</p><CTA href="/docs/getting-started/installation" variant="text">Read installation instructions</CTA></div>
    <ol className="install-steps">{content.steps.map((step, i) => <li key={step}><span>0{i + 1}</span>{step}<span className="step-arrow" aria-hidden="true">→</span></li>)}</ol>
  </LandingSection>
}
