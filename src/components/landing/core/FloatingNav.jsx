import React, {useEffect, useRef, useState} from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {useMotionValueEvent, useScroll} from 'motion/react'
import Button from './Button'
export default function FloatingNav({brand}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const scrollState = useRef(false)
  const {scrollY} = useScroll()
  useMotionValueEvent(scrollY, 'change', value => {
    const next = value > 24
    if (next !== scrollState.current) {scrollState.current = next; setScrolled(next)}
  })
  const toggle = useRef(null)
  const nav = useRef(null)
  const logo = useBaseUrl(brand.logo)
  useEffect(() => {
    if (!open) return
    nav.current?.querySelector('.nav-links a')?.focus()
    const close = event => {
      if (event.key === 'Escape') {setOpen(false); toggle.current?.focus()}
      if (event.type === 'pointerdown' && !nav.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', close)
    document.addEventListener('pointerdown', close)
    return () => {document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close)}
  }, [open])
  return <header className={`floating-header ${scrolled ? 'is-scrolled' : ''}`}><nav aria-label="Main navigation" className="floating-nav glass-layer" ref={nav}>
    <Link to="/" className="site-brand" aria-label={`${brand.name} home`}><img src={logo} width="30" height="30" alt="" /><span>{brand.name}</span></Link>
    <div className={`nav-links ${open ? 'is-open' : ''}`} id="landing-navigation">
      {brand.navigation.map(link => <Link key={link.href} to={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
    </div>
    <Button href="#install" className="nav-install">Install {brand.name}</Button>
    <button className="nav-toggle" aria-expanded={open} aria-controls="landing-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} ref={toggle} onClick={() => setOpen(!open)}><span aria-hidden="true">{open ? '×' : '☰'}</span></button>
  </nav></header>
}
