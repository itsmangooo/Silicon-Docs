import React from 'react'
import StageStructure from '../graphics/StageStructure'

// The capture stays in normal document flow. Only separate structural marks
// respond to viewport entry; no motion applies to this wrapper or its image.
export default function HeroMediaStage({children, className = '', image}) {
  const dimensions = image?.width && image?.height ? `${image.width} × ${image.height}` : 'Product capture'
  return <div className={`hero-media-stage ${className}`}>
    <StageStructure label="Released interface" detail={`${dimensions} · sanitized capture`} />
    {children}
  </div>
}
