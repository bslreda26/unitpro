import { useId, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useI18n } from '../../i18n/I18nProvider.jsx'

const GALLERY_IMAGES = [
  {
    name: 'Strength training',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'HIIT session',
    img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Conditioning',
    img: 'https://images.unsplash.com/photo-1526401485004-2aa7bca48f03?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Mobility',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Boxing training',
    img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Gym equipment',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Barbell workout',
    img: 'https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=1400&q=80',
  },
  {
    name: 'Training floor',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1400&q=80',
  },
]

export function ClassesPreview() {
  const { t } = useI18n()
  const id = useId()
  const safeId = useMemo(() => id.replace(/[^a-zA-Z0-9_-]/g, ''), [id])

  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
    }),
    [],
  )

  return (
    <section ref={ref} className="bg-dark py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={fadeUp}
          className="flex items-end justify-between gap-6"
        >
          <div>
            <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
              {t('classesPreview.label')}
            </div>
            <h2 className="mt-3 font-display text-5xl tracking-wide text-white md:text-6xl">
              {t('classesPreview.title')}
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.06 }}
          className="mt-10"
        >
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
            aria-labelledby={`gallery-${safeId}`}
          >
            {GALLERY_IMAGES.map((img) => (
              <div
                key={img.img}
                className="group relative aspect-square overflow-hidden border border-border bg-surface sm:aspect-[4/5]"
              >
                <img
                  src={img.img}
                  alt={img.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
                    {img.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

