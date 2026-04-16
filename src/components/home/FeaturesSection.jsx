import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Clock, CupSoda, Dumbbell, ShieldCheck } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider.jsx'

const FEATURE_ICONS = [Clock, ShieldCheck, Dumbbell, CupSoda]

export function FeaturesSection() {
  const { dict, t } = useI18n()
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const container = useMemo(
    () => ({
      hidden: {},
      show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
    }),
    [],
  )

  const card = useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 320, damping: 28 },
      },
    }),
    [],
  )

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-dark py-14 sm:py-20"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,60,68,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,60,68,0.06) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/70 to-dark" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
            {t('features.label')}
          </div>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,9vw,3.75rem)] tracking-wide text-white md:text-6xl">
            {t('features.title')}
          </h2>
        </div>

        <motion.div
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4 lg:gap-6"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {(dict.features?.items ?? []).map(({ title, description }, idx) => {
            const Icon = FEATURE_ICONS[idx] ?? Clock
            return (
              <motion.article
                key={`${title}-${idx}`}
                variants={card}
                className="group relative flex h-full min-h-0 flex-col border border-border bg-surface p-4 transition-transform active:scale-[0.99] sm:p-6 sm:hover:-translate-y-1"
              >
                <div className="absolute left-0 top-0 h-[3px] w-full bg-transparent transition-colors group-hover:bg-primary" />
                <div className="flex min-h-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 sm:h-11 sm:w-11">
                    <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-body text-[11px] font-semibold uppercase leading-tight tracking-wider text-white sm:text-sm sm:tracking-widest">
                      {title}
                    </h3>
                    <p className="mt-1.5 font-body text-[11px] leading-snug text-text-muted sm:mt-2 sm:text-sm sm:leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

