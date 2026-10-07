import React from 'react'
import Link from '@docusaurus/Link'
import LandingContainer from '../core/LandingContainer'
import {Eyebrow} from '../core/SectionHeader'
import CTA from '../core/CTA'
import MediaFrame from '../core/MediaFrame'
import Reveal from '../motion/Reveal'
import Stagger from '../motion/Stagger'

export default function HeroSection({product}) {
  const {hero} = product
  return <section className="landing-hero" aria-labelledby="hero-title">
    <LandingContainer>
      <div className="hero-intro">
        <Stagger className="hero-heading">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 id="hero-title">{hero.title[0]}<br /><span>{hero.title[1]}</span></h1>
        </Stagger>
        <Stagger className="hero-support">
          <p>{hero.description}</p>
          <div className="hero-actions"><CTA href="#install">Install {product.name}</CTA><CTA href="/docs/" variant="text">Read the docs</CTA></div>
          <Link to={product.repository} className="hero-source">Open source on GitHub <span aria-hidden="true">↗</span></Link>
        </Stagger>
      </div>
      <Reveal media className="hero-media"><MediaFrame image={hero.image} label="The workspace" eager /></Reveal>
      <div className="hero-context"><p>A hybrid hosting platform for your own servers and the cloud.</p><Link to={`${product.repository}/releases/tag/${product.release}`}>Product reference: {product.release} <span aria-hidden="true">↗</span></Link></div>
    </LandingContainer>
  </section>
}
