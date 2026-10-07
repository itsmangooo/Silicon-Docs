import React from 'react'
import useBrokenLinks from '@docusaurus/useBrokenLinks'
import LandingContainer from './LandingContainer'

export default function LandingSection({id, className = '', children}) {
  useBrokenLinks().collectAnchor(id)
  return <section id={id} className={`landing-section ${className}`} aria-labelledby={`${id}-title`}>
    <LandingContainer>{children}</LandingContainer>
  </section>
}
