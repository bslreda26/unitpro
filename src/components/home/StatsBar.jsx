import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useI18n } from '../../i18n/I18nProvider.jsx'

function useCountUp({ to, start, durationMs, enabled }) {
  const [value, setValue] = useState(start)

  useEffect(() => {
    if (!enabled) return

    let raf = 0
    const t0 = performance.now()
    const from = start
    const delta = to - from

    const tick = (t) => {
      const p = Math.min(1, (t - t0) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + delta * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, enabled, start, to])

  return value
}

function Stat({ valueTo, suffix = '', label, divider }) {
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true })
  const value = useCountUp({
    to: valueTo,
    start: 0,
    durationMs: 950,
    enabled: inView,
  })

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center border border-primary/20 bg-[#120000]/40 px-2 py-4 text-center backdrop-blur-sm sm:px-4 sm:py-5 md:py-6"
    >
      <div className="font-display text-4xl leading-none tracking-wide text-white sm:text-5xl md:text-6xl">
        {value}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-1.5 font-body text-[9px] font-semibold uppercase leading-snug tracking-wide text-white/80 sm:mt-2 sm:text-[11px] sm:tracking-widest">
        {label}
      </div>
    </div>
  )
}

export function StatsBar() {
  const { t } = useI18n()
  const variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 260, damping: 26 },
      },
    }),
    [],
  )

  return (
    <section className="relative z-[1] w-full bg-[#1A0000]">
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-4 py-5 sm:grid-cols-4 sm:gap-3 sm:px-6 sm:py-8"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={variants}
      >
        <Stat valueTo={100} suffix="%" label={t('stats.members')} />
        <Stat valueTo={7} suffix={t('stats.accessSuffix')} label={t('stats.access')} />
        <Stat valueTo={10} suffix="+" label={t('stats.classesPerWeek')} />
        <Stat valueTo={2} suffix="" label={t('stats.expertTrainers')} />
      </motion.div>
    </section>
  )
}

