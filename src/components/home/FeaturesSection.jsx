import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Dumbbell,
  Flame,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider.jsx'

const WHY_ICONS = [Target, Flame, Dumbbell, ShieldCheck, Sparkles, Users, HeartHandshake]

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

  const items = dict.whyChoose?.items ?? []

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
      <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/70 to-dark" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <motion.div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
            {t('whyChoose.label')}
          </motion.div>
          <h2 className="mt-3 text-balance font-display text-[clamp(1.75rem,7vw,3rem)] tracking-wide text-white md:text-5xl">
            {t('whyChoose.title')}
          </h2>
        </div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {items.map(({ title }, idx) => {
            const Icon = WHY_ICONS[idx] ?? Target
            return (
              <motion.article
                key={`${title}-${idx}`}
                variants={card}
                className="group relative flex h-full min-h-0 flex-col border border-border bg-surface p-4 transition-transform active:scale-[0.99] sm:p-6 sm:hover:-translate-y-1"
              >
                <div className="absolute left-0 top-0 h-[3px] w-full bg-transparent transition-colors group-hover:bg-primary" />
                <div className="flex min-h-0 flex-1 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 sm:h-11 sm:w-11">
                    <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="min-w-0 flex-1 font-body text-sm font-semibold leading-snug tracking-wide text-white sm:text-base">
                    {title}
                  </h3>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
