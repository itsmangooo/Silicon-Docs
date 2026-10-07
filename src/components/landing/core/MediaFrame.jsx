import React from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'

export default function MediaFrame({image, label, eager = false, className = ''}) {
  const src = useBaseUrl(image.src)
  return <figure className={`media-frame ${className}`}>
    <a href={src} aria-label={`View full screenshot: ${label}`} className="media-frame-link">
      <img src={src} alt={image.alt} width={image.width} height={image.height}
        loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
    </a>
    <figcaption><span>{label}</span><span>Released UI · sanitized demo data</span></figcaption>
  </figure>
}
