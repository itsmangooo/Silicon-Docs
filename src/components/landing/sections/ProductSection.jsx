import React from 'react'
import LandingSection from '../core/LandingSection'
import SectionHeader from '../core/SectionHeader'
import CTA from '../core/CTA'
import MediaFrame from '../core/MediaFrame'
import Reveal from '../motion/Reveal'

export default function ProductSection({chapter, wide = false}) {
  return <LandingSection id={chapter.id || 'aws'} className={`product-chapter ${chapter.reverse ? 'product-chapter--reverse' : ''} ${wide ? 'product-chapter--wide' : ''}`}>
    <div className="product-composition">
      <Reveal className="product-copy">
        <SectionHeader id={chapter.id || 'aws'} {...chapter} />
        {!wide && <dl className="product-details">{chapter.details.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>}
        <CTA {...chapter.link} variant="text">{chapter.link.label}</CTA>
      </Reveal>
      <Reveal media className="product-media"><MediaFrame image={chapter.image} label={wide ? 'AWS Compute' : chapter.label.toLowerCase()} /></Reveal>
    </div>
    {wide && <>
      <dl className="capability-strip">{chapter.details.map(([term, detail]) => <div key={term}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>
      <p className="chapter-limitation">{chapter.limitation}</p>
    </>}
  </LandingSection>
}
