import React from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
export default function Footer({brand}) {
  return <footer className="landing-footer editorial-stage"><Link to="/" className="site-brand"><img src={useBaseUrl(brand.logo)} width="30" height="30" alt="" />Silicon</Link><div className="footer-links"><Link to="/docs/">Documentation</Link><Link to={brand.repository}>GitHub</Link><Link to="/docs/developers/contributing">Contribute</Link></div><p>Open source. Self-hosted. Your infrastructure.</p></footer>
}
