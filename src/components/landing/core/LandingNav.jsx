import React, {useEffect, useRef, useState} from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import LandingContainer from './LandingContainer'
import CTA from './CTA'

export default function LandingNav({brand, links}) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  const nav = useRef(null)
  const logo = useBaseUrl(brand.logo)
  useEffect(() => {
    if (open) nav.current?.querySelector('.landing-nav-links a')?.focus()
    const onEscape = event => {
      if (event.key === 'Escape' && open) {setOpen(false); menuButton.current?.focus()}
    }
    const onOutside = event => {
      if (open && !nav.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onEscape)
    document.addEventListener('pointerdown', onOutside)
    return () => {document.removeEventListener('keydown', onEscape); document.removeEventListener('pointerdown', onOutside)}
  }, [open])
  return <header className="landing-nav-position">
    <LandingContainer>
      <nav ref={nav} className="landing-nav" aria-label="Main navigation">
        <Link className="landing-brand" to="/" aria-label={`${brand.name} home`}>
          <img src={logo} width="24" height="28" alt="" /><span>{brand.name}</span>
        </Link>
        <div id="landing-navigation" className={`landing-nav-links ${open ? 'is-open' : ''}`}>
          {links.map(link => <Link key={link.label} to={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
        </div>
        <CTA href="#install" className="nav-install">Install<span className="nav-install-name"> {brand.name}</span></CTA>
        <button ref={menuButton} className="landing-menu-toggle" aria-expanded={open}
          aria-controls="landing-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
            <path d={open ? 'M5 5l10 10M15 5 5 15' : 'M3 6h14M3 14h14'} stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </nav>
    </LandingContainer>
  </header>
}
