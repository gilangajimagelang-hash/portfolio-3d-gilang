'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { HeroVisual } from './hero-visual'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-16 md:pt-24"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 right-0 size-[40rem] rounded-full bg-primary/20 blur-[140px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 -left-40 size-[30rem] rounded-full bg-violet/15 blur-[140px]" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-6 lg:grid-cols-[1.1fr_1fr]">
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease }}
            className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs text-muted-foreground"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-neon opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-neon" />
            </span>
            Open to internships & collaborations
          </motion.p>

          <h1 className="text-[clamp(2.75rem,7.2vw,6rem)] font-bold leading-[0.92] tracking-[-0.045em]">
            {['CRAFTING', 'DIGITAL', 'EXPERIENCES'].map((word, i) => (
              <span key={word} className="block overflow-hidden pb-1">
                <motion.span
                  className={i === 2 ? 'text-gradient block' : 'block'}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 1.15 + i * 0.1, ease }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease }}
          >
            <p className="text-glow mt-7 font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-neon md:text-sm">
              Informatics Engineering Student <span className="text-muted-foreground">|</span> Web
              Developer <span className="text-muted-foreground">|</span> Creative Technologist
            </p>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {"I'm an Informatics Engineering student passionate about web development, database systems, UI/UX, and interactive technology — turning ideas into fast, thoughtful and memorable digital products."}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-neon px-6 py-3 text-sm font-semibold text-background shadow-[0_0_40px_rgb(34_211_238/0.35)] transition-all hover:shadow-[0_0_60px_rgb(34_211_238/0.55)]"
              >
                Explore My Work
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:border-neon/50 hover:text-neon"
              >
                Contact Me
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: visualY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1, ease }}
          className="relative order-1 h-[320px] sm:h-[420px] lg:order-2 lg:h-[600px]"
        >
          <HeroVisual />
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-neon md:flex"
      >
        Scroll
        <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  )
}
