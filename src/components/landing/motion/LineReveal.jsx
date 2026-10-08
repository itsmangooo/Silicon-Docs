import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from './MotionProvider'
import useEntrance from './useEntrance'

function Line({children, full, inView, duration, stagger, index, variant, desktopStory}) {
  const travel = desktopStory ? 28 : 12
  const variants = {
    rise: {from: {y: '105%', x: 0, opacity: 1}, delay: index * stagger, duration},
    lateral: {from: {y: '65%', x: index % 2 ? travel : -travel, opacity: 0.5}, delay: index * stagger * 1.2, duration},
    cascade: {from: {y: '105%', x: index ? '3%' : '0%', opacity: 1}, delay: index * stagger * 2, duration},
    quiet: {from: {y: '12%', x: 0, opacity: 0.2}, delay: index * stagger * 0.75, duration: duration * 0.75},
  }
  const entrance = variants[variant] || variants.rise
  const controls = useEntrance({
    full, inView,
    from: entrance.from, to: {y: '0%', x: 0, opacity: 1},
    transition: {duration: entrance.duration, delay: entrance.delay},
  })
  return <m.span className="line-reveal__line" initial={false} animate={controls}>{children}</m.span>
}

export default function LineReveal({lines, as: Tag = 'h2', className = '', id, variant = 'rise'}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, duration, stagger, desktopStory} = useLandingMotion()
  const full = ready && !reduced
  return <Tag ref={ref} className={`line-reveal line-reveal--${variant} ${className}`} id={id}>
    {lines.map((line, index) => <React.Fragment key={index}>
      <span className="line-reveal__mask"><Line full={full} inView={inView} duration={duration} stagger={stagger} desktopStory={desktopStory} variant={variant} index={index}>{line}</Line></span>
      {index < lines.length - 1 ? ' ' : null}
    </React.Fragment>)}
  </Tag>
}
