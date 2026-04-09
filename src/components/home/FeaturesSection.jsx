import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Clock, Dumbbell, ShieldCheck, Users } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider.jsx'

const FEATURE_ICONS = [Clock, ShieldCheck, Dumbbell, Users]

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
      className="relative overflow-hidden bg-dark py-20"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,60,68,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,60,68,0.06) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/70 to-dark" />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="text-center">
          <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
            {t('features.label')}
          </div>
          <h2 className="mt-3 font-display text-5xl tracking-wide text-white md:text-6xl">
            {t('features.title')}
          </h2>
        </div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
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
                className="group relative h-full border border-border bg-surface p-6 transition-transform hover:-translate-y-1"
              >
                <div className="absolute left-0 top-0 h-[3px] w-full bg-transparent transition-colors group-hover:bg-primary" />
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-body text-sm font-semibold uppercase tracking-widest text-white">
                      {title}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
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

