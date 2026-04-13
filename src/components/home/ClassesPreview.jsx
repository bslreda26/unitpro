import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useI18n } from '../../i18n/I18nProvider.jsx'

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526401485004-2aa7bca48f03?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
]

export function ClassesPreview() {
  const { t } = useI18n()
  const { ref, inView } = useInView({ threshold: 0.06, triggerOnce: true })

  const container = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: 0.055, delayChildren: 0.06 },
      },
    }),
    [],
  )

  const cell = useMemo(
    () => ({
      hidden: { opacity: 0, y: 18, scale: 0.96 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 380, damping: 26 },
      },
    }),
    [],
  )

  return (
    <section
      ref={ref}
      aria-label={t('classesPreview.label')}
      className="relative overflow-hidden bg-dark py-10 sm:py-14 md:py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(227,27,35,0.2),transparent_55%)]" />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={
            inView
              ? { opacity: 1, letterSpacing: '0.35em' }
              : { opacity: 0, letterSpacing: '0.5em' }
          }
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-center font-body text-[10px] font-semibold uppercase text-primary/90 sm:mb-8 sm:text-[11px]"
        >
          {t('classesPreview.label')}
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3"
        >
          {GALLERY_IMAGES.map((src, idx) => (
            <motion.div
              key={src}
              variants={cell}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_16px_40px_rgba(0,0,0,0.35)] sm:aspect-square"
            >
              <motion.img
                src={src}
                alt={`${t('classesPreview.label')} ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover saturate-110"
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute bottom-2 left-2 border border-primary/50 bg-black/45 px-2 py-1 font-body text-[9px] font-semibold uppercase tracking-widest text-white/90 sm:bottom-3 sm:left-3 sm:text-[10px]">
                UNIT PRO
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
