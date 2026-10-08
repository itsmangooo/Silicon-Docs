import React from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import {useLandingMotion} from '../motion/MotionProvider'
export default function Footer({brand}) {
  const {manualReduced, setManualReduced, systemReduced} = useLandingMotion()
  return <footer className="landing-footer editorial-stage"><Link to="/" className="site-brand"><img src={useBaseUrl(brand.logo)} width="30" height="30" alt="" />Silicon</Link><div className="footer-links"><Link to="/docs/">Documentation</Link><Link to={brand.repository}>GitHub</Link><Link to="/docs/developers/contributing">Contribute</Link></div><label className="motion-preference"><input type="checkbox" checked={manualReduced || systemReduced} disabled={systemReduced} onChange={event => setManualReduced(event.target.checked)} />Reduce motion</label><p>Open source. Self-hosted. Your infrastructure.<span>Product reference: {brand.release}</span></p></footer>
}
