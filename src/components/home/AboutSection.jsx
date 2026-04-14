import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useI18n } from '../../i18n/I18nProvider.jsx'

const ABOUT_IMG_PRIMARY =
  'https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=1800&q=80'
const ABOUT_IMG_FALLBACK =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1800&q=80'

export function AboutSection() {
  const { t } = useI18n()
  const { ref, inView } = useInView({ threshold: 0.25, triggerOnce: true })
  const [src, setSrc] = useState(ABOUT_IMG_PRIMARY)
  const placeholder = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a0000"/>
      <stop offset="0.55" stop-color="#0b0b0b"/>
      <stop offset="1" stop-color="#b91c1c"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <g fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2">
    <path d="M80 720 L420 380 L680 620 L840 460 L1120 720" />
    <rect x="80" y="160" width="1040" height="580" rx="18"/>
  </g>
  <g fill="rgba(255,255,255,0.86)" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-weight="700">
    <text x="100" y="235" font-size="34">
      <tspan>UNIT </tspan>
      <tspan fill="#e31b23">PRO</tspan>
      <tspan dx="10" font-size="14" letter-spacing="4" fill="rgba(255,255,255,0.7)">STUDIO</tspan>
    </text>
    <text x="100" y="285" font-size="18" fill="rgba(255,255,255,0.68)">Espace d’entraînement</text>
  </g>
</svg>`
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }, [])

  return (
    <section ref={ref} className="relative bg-dark py-14 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 sm:gap-10 sm:px-6 md:grid-cols-2 md:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="group relative"
        >
          <div className="relative overflow-hidden border border-border bg-surface shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <motion.img
              src={src}
              alt={t('about.imageAlt')}
              className="h-[380px] w-full origin-center object-cover md:h-[520px]"
              initial={{ opacity: 0, scale: 1.12, rotate: -5, y: 18 }}
              animate={inView ? { opacity: 1, scale: 1.05, rotate: -2, y: 0 } : {}}
              whileHover={{ scale: 1.09, rotate: -0.8 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              loading="eager"
              fetchPriority="high"
              referrerPolicy="no-referrer"
              onError={() => {
                if (src !== ABOUT_IMG_FALLBACK) setSrc(ABOUT_IMG_FALLBACK)
                else if (src !== placeholder) setSrc(placeholder)
              }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)]"
              initial={{ x: '-130%', opacity: 0 }}
              animate={inView ? { x: '130%', opacity: [0, 0.55, 0] } : {}}
              transition={{ duration: 1.25, ease: 'easeInOut', delay: 0.25 }}
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -left-4 h-16 w-16 border-l-2 border-b-2 border-primary"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.06 }}
        >
          <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
            {t('about.label')}
          </div>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,9vw,3.75rem)] leading-[0.95] tracking-wide text-white md:text-6xl">
            {t('about.title')}
          </h2>

          <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-text-muted">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </div>

          <div className="mt-7 h-px w-24 bg-primary" />
        </motion.div>
      </div>
    </section>
  )
}

