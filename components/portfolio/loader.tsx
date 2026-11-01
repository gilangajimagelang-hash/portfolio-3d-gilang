'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

export function Loader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), 1100)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className="flex flex-col items-center gap-5">
            <motion.span
              className="font-mono text-sm tracking-[0.5em] text-foreground"
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 0.8 }}
            >
              GILANG
            </motion.span>
            <div className="h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-neon to-violet"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
