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
  'https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80',
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
      className="bg-dark py-10 sm:py-14 md:py-16"
    >
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
          className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4 lg:gap-2.5"
        >
          {GALLERY_IMAGES.map((src) => (
            <motion.div
              key={src}
              variants={cell}
              className="relative aspect-[4/5] overflow-hidden bg-surface sm:aspect-square"
            >
              <motion.img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
