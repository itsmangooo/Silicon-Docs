import React from 'react'
import LandingSection from '../core/LandingSection'
import SectionHeader from '../core/SectionHeader'
import CTA from '../core/CTA'
import Reveal from '../motion/Reveal'

export default function SecuritySection({content}) {
  return <LandingSection id="security" className="security-chapter">
    <div className="security-composition">
      <Reveal><SectionHeader id="security" {...content} /><CTA {...content.link} variant="text">{content.link.label}</CTA></Reveal>
      <dl className="security-details">{content.items.map(([term, detail], i) => <Reveal key={term} order={i}><dt><span aria-hidden="true">0{i + 1}</span>{term}</dt><dd>{detail}</dd></Reveal>)}</dl>
    </div>
  </LandingSection>
}
