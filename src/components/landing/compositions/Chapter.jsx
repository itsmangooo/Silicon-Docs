import React from 'react'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import MacroReveal from '../motion/MacroReveal'
// Macro geometry, not a generic feature-card template.
export default function Chapter({id, className = '', tone, children}) {
  const {collectAnchor} = useBrokenLinks()
  collectAnchor(id)
  collectAnchor(`${id}-title`)
  return <section id={id} aria-labelledby={`${id}-title`} className={`chapter ${tone ? `chapter--${tone}` : ''} ${className}`}>{tone && <MacroReveal variant="shell" className="chapter-surface" aria-hidden="true" />}{children}</section>
}
export function EditorialStage({children, className = ''}) {
  return <div className={`editorial-stage ${className}`}>{children}</div>
}
export function CurvedStage({children, className = ''}) {
  return <div className={`curved-stage ${className}`}><MacroReveal className="curved-stage__surface" aria-hidden="true" />{children}</div>
}
export function FactRail({items}) {
  return <dl className="fact-rail">{items.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
}
