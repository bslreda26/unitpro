import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'

export function ScrollToTopButton() {
  const { t } = useI18n()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label={t('a11y.scrollTop')}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px)+0.5rem)] right-[max(1.25rem,env(safe-area-inset-right,0px)+0.25rem)] z-[70] inline-flex h-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-sm bg-primary text-white shadow-[0_18px_45px_rgba(227,27,35,0.20)] active:scale-95"
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          whileHover={{ scale: 1.05, backgroundColor: '#FF3C44' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

