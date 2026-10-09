import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function MediaFrame({image, eager = false, crop = false, className = '', children}) {
  const src = useBaseUrl(image.src)
  return <figure className={`product-media ${crop ? 'product-media--crop' : ''} ${className}`}>
      <a href={src} className="product-media__link">
        <img src={src} width={image.width} height={image.height} alt={image.alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
      </a>
    {children}
  </figure>
}
