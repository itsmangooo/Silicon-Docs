import React from 'react'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import ChapterLabel from '../core/ChapterLabel'
import Button from '../core/Button'
import MediaFrame from '../core/MediaFrame'
import LineReveal from '../motion/LineReveal'
import SupportingReveal from '../motion/SupportingReveal'
import HeroMediaStage from '../compositions/HeroMediaStage'
export default function HeroChapter({content}) {
  const {collectAnchor} = useBrokenLinks()
  collectAnchor('hero')
  collectAnchor('hero-title')
  collectAnchor('landing-main')
  return <section id="hero" className="hero-chapter" aria-labelledby="hero-title">
    <div className="hero-billboard editorial-stage">
      <ChapterLabel>{content.label}</ChapterLabel>
      <LineReveal lines={content.title} as="h1" id="hero-title" className="hero-title" />
      <SupportingReveal className="hero-aside" delay={.3}><p className="lead">{content.description}</p><div className="action-row"><Button href="#install">Install Silicon</Button><Button variant="text" href="/docs/">Read the docs</Button></div><p className="small-note">Open source. Self-hosted. Still evolving.</p></SupportingReveal>
    </div>
    <HeroMediaStage className="hero-proof"><MediaFrame image={content.image} eager crop /></HeroMediaStage>
  </section>
}
