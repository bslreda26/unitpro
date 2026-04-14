import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function LoadingScreen({ show, onDone }) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => onDone?.(), 1500)
    return () => clearTimeout(t)
  }, [onDone, show])

  const unitLetters = 'UNIT'.split('')
  const proLetters = 'PRO'.split('')

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark px-4 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="w-full max-w-lg px-4 text-center sm:px-8">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="font-display text-[clamp(2.75rem,14vw,4.5rem)] tracking-[0.12em] sm:text-7xl md:text-8xl"
            >
              {unitLetters.map((ch, i) => (
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
                  className="inline-block text-white"
                >
                  {ch}
                </motion.span>
              ))}
              <span className="inline-block w-5" aria-hidden="true" />
              {proLetters.map((ch, i) => (
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
                  className="inline-block text-primary"
                >
                  {ch}
                </motion.span>
              ))}
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { type: 'spring', stiffness: 520, damping: 34 },
                  },
                }}
                className="ml-3 inline-block align-super font-body text-[0.2em] font-semibold uppercase tracking-[0.35em] text-white/80"
              >
                TRAINING CENTER
              </motion.span>
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

