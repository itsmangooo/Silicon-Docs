import React from 'react'
import Link from '@docusaurus/Link'
export default function Button({href, children, variant = 'primary', className = '', ...props}) {
  return <Link to={href} className={`site-button site-button--${variant} ${className}`} {...props}>{children}<span aria-hidden="true">↗</span></Link>
}
