import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'
import useEntrance from './useEntrance'

function Line({children, full, inView, duration, index}) {
  const controls = useEntrance({
    full, inView,
    from: {y: '105%'}, to: {y: '0%'},
    transition: {duration, delay: index * duration * 0.08},
  })
  return <m.span className="line-reveal__line" initial={false} animate={controls}>{children}</m.span>
}

export default function LineReveal({lines, as: Tag = 'h2', className = '', id}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, duration} = useLandingMotion()
  const full = ready && !reduced
  return <Tag ref={ref} className={`line-reveal ${className}`} id={id}>
    {lines.map((line, index) => <React.Fragment key={index}>
      <span className="line-reveal__mask"><Line full={full} inView={inView} duration={duration} index={index}>{line}</Line></span>
      {index < lines.length - 1 ? ' ' : null}
    </React.Fragment>)}
  </Tag>
}
