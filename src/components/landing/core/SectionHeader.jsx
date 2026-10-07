import React from 'react'

export function Eyebrow({number, children}) {
  return <p className="landing-eyebrow">{number && <span className="chapter-number">{number}</span>}{children}</p>
}

export default function SectionHeader({id, number, label, title, description}) {
  return <div className="section-header">
    <Eyebrow number={number}>{label}</Eyebrow>
    <h2 id={`${id}-title`}>{title}</h2>
    {description && <p className="section-description">{description}</p>}
  </div>
}
