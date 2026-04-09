import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function LoadingScreen({ show, onDone }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => onDone?.(), 1500)
    return () => clearTimeout(t)
  }, [onDone, show])

  const letters = 'UNIT PRO'.split('')

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="w-full max-w-lg px-8 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="font-display text-7xl tracking-[0.12em] text-white md:text-8xl"
            >
              {letters.map((ch, i) => (
                <motion.span
                  key={`${ch}-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { type: 'spring', stiffness: 520, damping: 34 },
                    },
                  }}
                  className={ch === ' ' ? 'inline-block w-5' : 'inline-block'}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.div>

            <div className="mt-10 h-1 w-full bg-white/10">
              <motion.div
                className="h-1 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.35, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

