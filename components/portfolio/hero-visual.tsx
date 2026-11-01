'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useReducedMotion } from 'motion/react'

const HeroScene = dynamic(() => import('./hero-scene'), {
  ssr: false,
  loading: () => <FallbackOrb />,
})

function FallbackOrb() {
  return (
    <div className="flex size-full flex-col items-center" aria-hidden="true">
      <div className="h-[28%] w-5 bg-[repeating-linear-gradient(180deg,#eef3fb_0_28px,#16306b_28px_32px)] shadow-[0_0_30px_rgb(59_130_255/0.35)]" />
      <div className="-mt-1 size-5 rounded-full border-4 border-zinc-300" />
      <div className="relative mt-1 aspect-[0.625] h-[58%] -rotate-3 overflow-hidden rounded-xl border border-white/30 bg-white/10 p-1.5 shadow-[0_30px_80px_rgb(0_0_0/0.5),0_0_60px_rgb(34_211_238/0.25)] backdrop-blur-sm">
        <Image
          src="/images/name-card.jpg"
          alt=""
          fill
          sizes="240px"
          className="rounded-lg object-cover p-1.5"
          priority
        />
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
      {webgl && !contextLost && (
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
          Drag the card
        </p>
      )}
    </div>
  )
}
