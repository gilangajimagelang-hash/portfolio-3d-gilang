
'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navItems } from '@/lib/portfolio-data'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6">
      <nav
        aria-label="Main navigation"
        className={cn(
          'mx-auto flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-3 sm:px-5',
          'transition-all duration-500',
          scrolled
            ? 'glass shadow-[0_8px_40px_rgb(0_0_0/0.5)]'
            : 'border border-transparent',
        )}
      >
        <a
          href="#home"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-2 font-mono text-xs font-semibold tracking-[0.25em] sm:text-sm sm:tracking-[0.35em]"
        >
          <span
            className="size-2 rounded-full bg-neon shadow-[0_0_12px_#22d3ee]"
            aria-hidden="true"
          />
          GILANG
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-full border border-neon/40 px-4 py-2 text-sm text-neon transition-all hover:bg-neon hover:text-background md:inline-flex"
        >
          {"Let's talk"}
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-[60] inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-50 flex min-h-dvh flex-col justify-center overflow-y-auto bg-background/95 px-6 pb-10 pt-24 backdrop-blur-xl md:hidden sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="mx-auto flex w-full max-w-md flex-col gap-2">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-3 text-3xl font-semibold tracking-tight transition-colors hover:text-neon sm:text-4xl"
                  >
                    <span className="font-mono text-xs text-neon">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
