import { NavLink } from 'react-router-dom'
import { Parallax } from 'react-scroll-parallax'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'

const HERO_BG =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400&q=80'

export function Hero() {
  const { t } = useI18n()
  const { scrollY } = useScroll()
  const ghostRotate = useTransform(scrollY, [0, 600], [-2, 2])

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 420, damping: 34 },
    },
  }

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-dark">
      <Parallax speed={-12}>
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `linear-gradient(110deg, rgba(10,10,10,0.88), rgba(10,10,10,0.55)), url(${HERO_BG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: 'unitpro-kenburns 18s ease-in-out infinite alternate',
              transformOrigin: 'center',
            }}
          />
        </div>
      </Parallax>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-3 bg-primary"
        style={{ transform: 'skewX(-10deg)' }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl items-center px-6 pt-10">
        <motion.div
          className="w-full"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={item}
            className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary"
          >
            {t('hero.kicker')}
          </motion.p>

          <div className="relative mt-6">
            <motion.div
              aria-hidden="true"
              style={{ rotate: ghostRotate }}
              className="pointer-events-none absolute -left-3 -top-16 select-none font-display text-[clamp(96px,14vw,220px)] leading-none tracking-[0.06em] text-transparent opacity-35"
            >
              <span className="[text-shadow:0_0_0_#E31B23] [-webkit-text-stroke:2px_#E31B23]">
                UNIT PRO
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="relative font-display text-[clamp(56px,8vw,92px)] leading-[0.9] tracking-wide text-white"
            >
              {t('hero.h1')}
            </motion.h1>
            <motion.h2
              variants={item}
              className="relative font-display text-[clamp(80px,12vw,160px)] leading-[0.86] tracking-[0.02em] text-white"
            >
              {t('hero.h2')}
            </motion.h2>
          </div>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl font-body text-base text-text-muted md:text-lg"
          >
            {t('hero.body')}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <NavLink
              to="/subscriptions"
              className="inline-flex h-12 items-center justify-center bg-primary px-7 font-body text-xs font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.03] hover:bg-accent"
            >
              {t('hero.ctaPrimary')}
            </NavLink>
            <NavLink
              to="/classes"
              className="inline-flex h-12 items-center justify-center border border-white/80 bg-transparent px-7 font-body text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:border-white hover:bg-white hover:text-dark"
            >
              {t('hero.ctaSecondary')}
            </NavLink>
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.4 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-white/80"
          >
            <ArrowDown className="h-5 w-5" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.26em]">
              {t('hero.scroll')}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

