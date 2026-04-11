import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { HERO_POSTER_URL, HERO_VIDEO_URL } from '../constants/heroMedia.js'

export function Hero() {
  const { t } = useI18n()
  const prefersReducedMotion = useReducedMotion()
  const videoRef = useRef(null)
  const playStartedRef = useRef(false)
  const [posterOnTop, setPosterOnTop] = useState(true)

  useEffect(() => {
    if (prefersReducedMotion) return
    const v = videoRef.current
    if (!v) return

    const run = () => {
      if (playStartedRef.current) return
      playStartedRef.current = true
      void v
        .play()
        .then(() => {
          setPosterOnTop(false)
        })
        .catch(() => {
          playStartedRef.current = false
        })
    }

    if (v.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      run()
    } else {
      v.addEventListener('canplay', run, { once: true })
    }

    const fallback = window.setTimeout(() => {
      if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) run()
    }, 12000)

    return () => {
      window.clearTimeout(fallback)
      v.removeEventListener('canplay', run)
    }
  }, [prefersReducedMotion])

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const stagger = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  }

  return (
    <section className="relative -mt-unit-header min-h-[100svh] w-full overflow-hidden bg-dark pt-unit-header">
      <div className="absolute inset-0">
        {!prefersReducedMotion ? (
          <>
            <video
              ref={videoRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
              muted
              loop
              playsInline
              preload="auto"
              poster={HERO_POSTER_URL}
            >
              <source src={HERO_VIDEO_URL} type="video/mp4" />
            </video>
            <img
              src={HERO_POSTER_URL}
              alt=""
              width={1600}
              height={900}
              decoding="async"
              loading="eager"
              fetchPriority="high"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700 ease-out"
              style={{ opacity: posterOnTop ? 1 : 0 }}
            />
          </>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_POSTER_URL})` }}
          />
        )}
        <div className="absolute inset-0 z-[2] bg-black/55" aria-hidden="true" />
        <div
          className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-transparent to-black/70"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem-env(safe-area-inset-top,0px))] max-w-4xl flex-col items-center justify-center px-4 py-8 text-center sm:px-6 md:py-14">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(2.5rem,10vw,4.5rem)] font-semibold leading-[1.05] tracking-wide text-white"
          >
            {t('hero.h1')}
          </motion.h1>
          <motion.h2
            variants={fadeUp}
            className="mt-1 font-display text-[clamp(2.75rem,12vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-white"
          >
            {t('hero.h2')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-sm font-body text-base text-white/85 md:max-w-md md:text-lg"
          >
            {t('hero.body')}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
          >
            <NavLink
              to="/subscriptions"
              className="inline-flex min-h-12 w-full items-center justify-center bg-primary px-6 font-body text-xs font-semibold uppercase tracking-widest text-white transition active:scale-[0.98] hover:bg-accent sm:w-auto sm:min-w-[10.5rem]"
            >
              {t('hero.ctaPrimary')}
            </NavLink>
            <NavLink
              to="/classes"
              className="inline-flex min-h-12 w-full items-center justify-center border border-white/90 px-6 font-body text-xs font-semibold uppercase tracking-widest text-white transition active:scale-[0.98] hover:bg-white hover:text-dark sm:w-auto sm:min-w-[10.5rem]"
            >
              {t('hero.ctaSecondary')}
            </NavLink>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom,0px)+0.25rem)] left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.35 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5 text-white/70"
        >
          <ArrowDown className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            {t('hero.scroll')}
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
