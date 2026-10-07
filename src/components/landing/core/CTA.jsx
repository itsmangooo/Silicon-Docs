import React from 'react'
import Link from '@docusaurus/Link'

export function ArrowIcon({diagonal = false}) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d={diagonal ? 'M4 12 12 4M4 4h8v8' : 'M2 8h12M9 3l5 5-5 5'} stroke="currentColor" strokeWidth="1.4" />
  </svg>
}

export default function CTA({href, children, label, variant = 'primary', className = '', ...props}) {
  const external = /^https?:/.test(href)
  return <Link to={href} className={`landing-cta landing-cta--${variant} ${className}`} {...props}>
    <span>{children || label}</span><ArrowIcon diagonal={external} />
  </Link>
}
