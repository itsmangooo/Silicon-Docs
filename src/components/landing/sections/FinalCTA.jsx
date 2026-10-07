import React from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import LandingContainer from '../core/LandingContainer'
import CTA from '../core/CTA'
import Reveal from '../motion/Reveal'

export default function FinalCTA({product}) {
  return <section className="final-cta" aria-labelledby="final-title"><LandingContainer><Reveal>
      <p className="landing-eyebrow">INFRASTRUCTURE YOU CONTROL</p>
      <h2 id="final-title">Start with one server.<br /><span>See where it takes you.</span></h2>
      <div className="final-actions"><CTA href="#install">Install {product.name}</CTA><CTA href="/docs/" variant="secondary">Documentation</CTA><CTA href={product.repository} variant="text">GitHub</CTA></div>
    </Reveal></LandingContainer></section>
}

export function LandingFooter({product}) {
  const logo = useBaseUrl(product.logo)
  return <footer className="landing-footer"><LandingContainer>
      <div className="footer-first"><Link to="/" className="landing-brand"><img src={logo} width="24" height="28" alt="" />{product.name}</Link><p>Hybrid hosting for your own servers and the cloud.</p></div>
      <div className="footer-last"><p>© {new Date().getFullYear()} {product.name} contributors</p><div><Link to="/docs/security/overview">Security</Link><Link to="/docs/developers/contributing">Contribute</Link><Link to={product.repository}>GitHub ↗</Link></div></div>
    </LandingContainer></footer>
}
