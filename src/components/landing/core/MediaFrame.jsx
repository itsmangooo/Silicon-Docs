import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import MediaReveal from '../motion/MediaReveal'
export default function MediaFrame({image, eager = false, crop = false, className = '', variant = 'settle', children}) {
  const src = useBaseUrl(image.src)
  return <figure className={`product-media ${crop ? 'product-media--crop' : ''} ${className}`}>
    <MediaReveal variant={variant}><a href={src} className="product-media__link">
      <img src={src} width={image.width} height={image.height} alt={image.alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
    </a></MediaReveal>{children}
    <figcaption>{image.caption} <a href={src}>View full capture ↗</a></figcaption>
  </figure>
}
