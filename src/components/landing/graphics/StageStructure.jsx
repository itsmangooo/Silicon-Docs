import React, {useRef} from 'react'
import {m, useInView} from 'motion/react'
import {useLandingMotion} from '../motion/MotionProvider'
import useEntrance from '../motion/useEntrance'

const corners = ['M0 52V0H52', 'M948 0H1000V52', 'M1000 548V600H948', 'M52 600H0V548']
const rails = ['M72 0H928', 'M1000 76V524', 'M928 600H72', 'M0 524V76']

function StructuralPath({d, index, full, inView, duration, stagger, className}) {
  const controls = useEntrance({full, inView, from: {pathLength: 0}, to: {pathLength: 1}, transition: {duration, delay: index * stagger}})
  return <m.path d={d} className={className} vectorEffect="non-scaling-stroke" initial={false} animate={controls} />
}

// Original registration marks around a real capture, not a fabricated device
// or browser. Descriptive metadata never represents live runtime status.
export default function StageStructure({label = 'Product capture', detail = ''}) {
  const ref = useRef(null)
  const inView = useInView(ref, {once: true, amount: 0.2})
  const {ready, reduced, duration, stagger} = useLandingMotion()
  const full = ready && !reduced
  const metadata = useEntrance({full, inView, from: {opacity: 0, x: 8}, to: {opacity: 1, x: 0}, transition: {duration: duration * 0.6, delay: stagger * 3}})

  return <div ref={ref} className="stage-structure" aria-hidden="true" data-graphic="capture-structure">
    <m.div className="stage-structure__metadata" initial={false} animate={metadata}><span>{label}</span><span>{detail}</span></m.div>
    <svg className="stage-structure__lines" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" focusable="false">
      {corners.map((d, index) => <StructuralPath key={d} d={d} index={index * 0.5} full={full} inView={inView} duration={duration} stagger={stagger} className="stage-structure__corner" />)}
      {rails.map((d, index) => <StructuralPath key={d} d={d} index={index + 1} full={full} inView={inView} duration={duration} stagger={stagger} className="stage-structure__line" />)}
    </svg>
  </div>
}
