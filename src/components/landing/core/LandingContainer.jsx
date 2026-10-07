import React from 'react'

export default function LandingContainer({as: Element = 'div', className = '', children, ...props}) {
  return <Element className={`landing-container ${className}`} {...props}>{children}</Element>
}
