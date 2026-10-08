import React from 'react'
import {m} from 'motion/react'
import useEntrance from '../motion/useEntrance'

const corners = [
  'M10 106 L10 10 L166 10',
  'M834 10 L990 10 L990 106',
  'M990 394 L990 490 L834 490',
  'M166 490 L10 490 L10 394',
]

function Rule({path, index, full, inView, duration, stagger}) {
  const controls = useEntrance({
    full, inView,
    from: {pathLength: 0},
    to: {pathLength: 1},
    transition: {duration, delay: index * stagger},
  })
  return <m.path d={path} className="security-boundary-rule" vectorEffect="non-scaling-stroke"
    initial={false} animate={controls} />
}

// Structural linework only. The adjacent heading and definition list carry
// every security claim, so this graphic adds no screen-reader content.
export default function BoundaryRules({full, inView, duration, stagger}) {
  return <svg className="security-boundary-rules" viewBox="0 0 1000 500" preserveAspectRatio="none"
    fill="none" aria-hidden="true" focusable="false">
    {corners.map((path, index) => <Rule key={path} path={path} index={index}
      full={full} inView={inView} duration={duration} stagger={stagger} />)}
  </svg>
}
