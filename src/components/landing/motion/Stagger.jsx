import React from 'react'
import Reveal from './Reveal'

export default function Stagger({children, className = ''}) {
  return <div className={className}>{React.Children.map(children, (child, order) => <Reveal order={order}>{child}</Reveal>)}</div>
}
