import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useI18n } from '../../i18n/I18nProvider.jsx'

export function FinalCTABanner() {
  const { t } = useI18n()
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-primary py-16 text-white"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 40%), repeating-linear-gradient(135deg, rgba(0,0,0,0.12) 0 10px, rgba(0,0,0,0.0) 10px 22px)',
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          <div className="font-display text-6xl leading-none tracking-wide md:text-7xl">
            {t('finalCta.title')}
          </div>
          <div className="mt-3 max-w-xl font-body text-sm text-white/90 md:text-base">
            {t('finalCta.body')}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.06 }}
        >
          <NavLink
            to="/subscriptions"
            className="inline-flex h-12 items-center justify-center bg-white px-8 font-body text-xs font-semibold uppercase tracking-widest text-dark transition-transform hover:scale-[1.03]"
          >
            {t('finalCta.cta')}
          </NavLink>
        </motion.div>
      </div>
    </section>
  )
}

