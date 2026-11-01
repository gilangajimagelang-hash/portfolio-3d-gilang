'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useReducedMotion } from 'motion/react'

const HeroScene = dynamic(() => import('./hero-scene'), {
  ssr: false,
  loading: () => <FallbackOrb />,
})

function FallbackOrb() {
  return (
    <div className="flex size-full items-center justify-center" aria-hidden="true">
      <div className="relative aspect-square w-[min(62%,20rem)]">
        <div className="absolute -inset-[30%] rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute inset-0 rotate-45 rounded-[28%] border border-white/15 bg-[linear-gradient(140deg,rgb(255_255_255/0.18),rgb(159_220_255/0.05)_45%,rgb(139_92_246/0.12))] shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_0_80px_rgb(34_211_238/0.25)] backdrop-blur-md" />
        <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle_at_30%_30%,#cfe9ff_0%,#3b82ff_35%,#0a1838_75%)] shadow-[0_0_60px_rgb(34_211_238/0.5)]" />
        <div className="absolute -inset-[22%] rounded-full border border-neon/30 [transform:rotateX(72deg)]" />
        <div className="absolute -inset-[36%] rounded-full border border-violet/25 [transform:rotateX(76deg)_rotateY(18deg)]" />
      </div>
    </div>
  )
}

let webglSupport: boolean | undefined

function hasWebGL() {
  if (webglSupport !== undefined) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    webglSupport = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    webglSupport = false
  }
  return webglSupport
}

const subscribeNoop = () => () => {}

function subscribeCompact(cb: () => void) {
  const mq = window.matchMedia('(max-width: 767px)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function HeroVisual() {
  const reducedMotion = useReducedMotion() ?? false
  const webgl = useSyncExternalStore(subscribeNoop, hasWebGL, () => false)
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia('(max-width: 767px)').matches,
    () => false,
  )
  const [contextLost, setContextLost] = useState(false)
  const [active, setActive] = useState(true)
  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: '100px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapper} className="relative size-full">
      <div
        className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgb(59_130_255/0.28),rgb(139_92_246/0.12)_45%,transparent_70%)] blur-2xl"
        aria-hidden="true"
      />
      {webgl && !contextLost ? (
        <HeroScene
          reducedMotion={reducedMotion}
          compact={compact}
          active={active}
          onContextLost={() => setContextLost(true)}
        />
      ) : (
        <FallbackOrb />
      )}
    </div>
  )
}
