import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import Chapter, {EditorialStage} from '../compositions/Chapter'
import Button from '../core/Button'
import LineReveal from '../motion/LineReveal'
import {useLandingMotion} from '../motion/MotionProvider'
import useEntrance from '../motion/useEntrance'

function Mechanism({title, text, index, full, inView, duration, stagger}) {
  const controls = useEntrance({
    full, inView,
    from: {opacity: 0, y: 8},
    to: {opacity: 1, y: 0},
    transition: {duration, delay: (index + 1) * stagger},
  })
  return <m.div className="security-mechanism" initial={false} animate={controls}>
    <dt>{title}</dt><dd>{text}</dd>
  </m.div>
}

export default function SecurityChapter({content}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, duration, stagger} = useLandingMotion()
  const full = ready && !reduced
  const support = useEntrance({
    full, inView,
    from: {opacity: 0, y: 8},
    to: {opacity: 1, y: 0},
    transition: {duration, delay: stagger},
  })
  return <Chapter id={content.id} className="security-chapter"><EditorialStage>
    <div ref={ref} className="security-composition security-boundary">
      <div className="security-statement">
        <LineReveal lines={content.title} id="security-title" className="security-title" />
        <m.div className="security-statement__support" initial={false} animate={support}>
          <p className="small-note">{content.note}</p>
          <Button variant="secondary" href={content.link.href}>{content.link.label}</Button>
        </m.div>
      </div>
      <dl className="security-mechanisms" aria-label="Security mechanisms">
        {content.items.map(([title, text], index) => <Mechanism key={title} title={title} text={text} index={index}
          full={full} inView={inView} duration={duration} stagger={stagger} />)}
      </dl>
    </div>
  </EditorialStage></Chapter>
}
