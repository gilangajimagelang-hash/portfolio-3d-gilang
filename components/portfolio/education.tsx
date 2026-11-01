'use client'

import { motion, useScroll, useSpring } from 'motion/react'
import { Briefcase, GraduationCap } from 'lucide-react'
import { useRef } from 'react'
import { timeline } from '@/lib/portfolio-data'
import { Reveal, SectionHeading } from './primitives'

export function Education() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="experience" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="04"
          eyebrow="Experience & Education"
          title={<>The journey <span className="text-gradient">so far.</span></>}
        />

        <div className="relative ml-3 md:mx-auto md:max-w-3xl">
          <div className="absolute top-0 bottom-0 left-0 w-px bg-white/10 md:left-1/2" aria-hidden="true" />
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-px origin-top bg-gradient-to-b from-neon via-primary to-violet shadow-[0_0_12px_#22d3ee] md:left-1/2"
            style={{ scaleY: progress }}
            aria-hidden="true"
          />

          <ol ref={listRef}>
          {timeline.map((item, i) => {
            const Icon = item.type === 'education' ? GraduationCap : Briefcase
            const right = i % 2 === 1
            return (
              <li key={`${item.title}-${i}`} className="relative pb-12 pl-10 last:pb-0 md:grid md:grid-cols-2 md:gap-12 md:pl-0">
                <span className="absolute top-1 left-0 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border border-neon/50 bg-background text-neon shadow-[0_0_16px_rgb(34_211_238/0.4)] md:left-1/2">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <Reveal
                  className={right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}
                  y={16}
                >
                  <div className="glass rounded-2xl p-5 transition-colors hover:border-neon/30">
                    <p className="font-mono text-xs uppercase tracking-widest text-neon">{item.period}</p>
                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-foreground/70">{item.place}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </Reveal>
              </li>
            )
          })}
          </ol>
        </div>
      </div>
    </section>
  )
}
