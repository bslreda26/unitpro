import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useI18n } from '../../i18n/I18nProvider.jsx'

import 'swiper/css'

function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
      ))}
    </div>
  )
}

function QuoteCard({ t }) {
  return (
    <article className="relative border border-border bg-surface p-7">
      <div className="absolute -top-4 left-6 font-display text-7xl leading-none text-primary">
        “
      </div>
      <p className="mt-6 font-body text-sm leading-relaxed text-white/90">
        {t.quote}
      </p>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 border border-primary/40 bg-primary/15" />
          <div className="font-body text-xs font-semibold uppercase tracking-widest text-white">
            {t.name}
          </div>
        </div>
        <Stars />
      </div>
    </article>
  )
}

export function TestimonialsSection() {
  const { dict, t } = useI18n()
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const fadeUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
    }),
    [],
  )

  const container = useMemo(
    () => ({
      hidden: {},
      show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
    }),
    [],
  )

  const card = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
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
          className="text-center"
        >
          <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
            {t('testimonials.label')}
          </div>
          <h2 className="mt-3 font-display text-5xl tracking-wide text-white md:text-6xl">
            {t('testimonials.title')}
          </h2>
        </motion.div>

        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          <motion.div
            className="contents"
            variants={container}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {(dict.testimonials?.items ?? []).map((item) => (
              <motion.div key={item.name} variants={card}>
                <QuoteCard t={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-12 md:hidden">
          <Swiper spaceBetween={14} slidesPerView={1.05} className="!overflow-visible">
            {(dict.testimonials?.items ?? []).map((item) => (
              <SwiperSlide key={item.name}>
                <QuoteCard t={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

