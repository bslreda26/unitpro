import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ArrowRight, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { getWhatsAppUrl } from '../utils/whatsapp.js'

import '../styles/fullcalendar.css'

const HERO_BG_PRIMARY =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400&q=80'
const HERO_BG_FALLBACK =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2400&q=80'

function useSvgPlaceholderDataUrl() {
  return useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1200" viewBox="0 0 2400 1200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#090909"/>
      <stop offset="0.55" stop-color="#120000"/>
      <stop offset="1" stop-color="#e31b23"/>
    </linearGradient>
  </defs>
  <rect width="2400" height="1200" fill="url(#g)"/>
  <g fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="3">
    <path d="M160 900 L720 360 L1120 760 L1440 520 L2240 900" />
    <rect x="160" y="180" width="2080" height="840" rx="26"/>
  </g>
</svg>`
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }, [])
}

const TAB_KEYS = ['All', 'Strength', 'Cardio', 'HIIT', 'Yoga', 'Boxing']
const CLASS_IMG_FALLBACK =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80'

const CLASSES = [
  {
    id: 'iron-circuit',
    category: 'Strength',
    name: 'Iron Circuit',
    duration: '45 MIN',
    level: 'Intermediate',
    trainer: 'Coach Nova',
    time: 'Mon / Wed / Fri — 6:00 PM',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'pulse-protocol',
    category: 'HIIT',
    name: 'Pulse Protocol',
    duration: '30 MIN',
    level: 'Advanced',
    trainer: 'Coach Vega',
    time: 'Mon / Thu — 7:00 AM',
    img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'engine-room',
    category: 'Cardio',
    name: 'Engine Room',
    duration: '50 MIN',
    level: 'All',
    trainer: 'Coach Atlas',
    time: 'Tue / Sat — 9:00 AM',
    img: 'https://images.unsplash.com/photo-1526401485004-2aa7bca48f03?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'flex-flow',
    category: 'Yoga',
    name: 'Flex & Flow',
    duration: '40 MIN',
    level: 'Beginner',
    trainer: 'Coach Luna',
    time: 'Tue / Thu — 9:00 AM',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'striker-series',
    category: 'Boxing',
    name: 'Striker Series',
    duration: '55 MIN',
    level: 'Intermediate',
    trainer: 'Coach Knox',
    time: 'Wed — 6:00 PM',
    img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'power-burn',
    category: 'Strength',
    name: 'Power Burn',
    duration: '60 MIN',
    level: 'Advanced',
    trainer: 'Coach Rhea',
    time: 'Sat — 10:00 AM',
    img: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1600&q=80',
  },
]

function levelTone(level) {
  const v = level.toLowerCase()
  if (v.includes('beginner')) return 'border-emerald-400/40 text-emerald-200'
  if (v.includes('advanced')) return 'border-primary/50 text-primary'
  return 'border-white/35 text-white/90'
}

function EventModal({ eventInfo, onClose }) {
  const { t } = useI18n()
  return (
    <AnimatePresence>
      {eventInfo && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-50 bg-black/60"
            aria-label={t('classesPage.modal.closeAria')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={[
              // Mobile: bottom sheet
              'fixed inset-x-0 bottom-0 z-[60] w-full border border-border bg-surface p-5',
              'rounded-t-2xl',
              // Desktop: centered modal
              'md:left-1/2 md:top-1/2 md:bottom-auto md:w-[92vw] md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-none md:p-6',
            ].join(' ')}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="mx-auto max-w-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-primary">
                    {eventInfo.extendedProps.category || t('classesPage.modal.classFallback')}
                  </div>
                  <div className="mt-2 font-display text-4xl tracking-wide text-white">
                    {eventInfo.title}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-dark/30 text-white/80 hover:text-white"
                  aria-label={t('classesPage.modal.close')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 max-h-[55vh] overflow-auto pr-1 md:max-h-none md:overflow-visible md:pr-0">
                <div className="font-body text-sm text-white/80">
                  {eventInfo.extendedProps.details || t('classesPage.modal.detailsFallback')}
                </div>

                <div className="mt-6 grid gap-3 border-t border-border pt-5 font-body text-sm text-white/80">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">{t('classesPage.modal.time')}</span>
                    <span>
                      {eventInfo.start?.toLocaleString([], {
                        weekday: 'short',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">{t('classesPage.modal.coach')}</span>
                    <span>
                      {eventInfo.extendedProps.trainer || t('classesPage.modal.staffFallback')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">{t('classesPage.modal.level')}</span>
                    <span>
                      {eventInfo.extendedProps.level || t('classesPage.modal.levelFallback')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={getWhatsAppUrl(
                    t('whatsapp.classBook').replace('{class}', eventInfo.title ?? ''),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-full items-center justify-center bg-primary px-6 font-body text-xs font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] hover:bg-accent md:w-auto md:justify-end"
                >
                  {t('classesPage.bookNow')}
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function ClassesPage() {
  const { dict, t, lang } = useI18n()
  const [active, setActive] = useState('All')
  const [modalEvent, setModalEvent] = useState(null)
  const placeholderBg = useSvgPlaceholderDataUrl()
  const [heroBg, setHeroBg] = useState(HERO_BG_PRIMARY)

  const filtered = useMemo(() => {
    if (active === 'All') return CLASSES
    return CLASSES.filter((c) => c.category === active)
  }, [active])

  const anchorMonday = useMemo(() => {
    // Anchor to "this week's Monday" to keep a stable weekly template (local time).
    const now = new Date()
    const day = now.getDay() // 0 Sun..6 Sat
    const diffToMon = (day + 6) % 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - diffToMon)
    monday.setHours(0, 0, 0, 0)
    return monday
  }, [])

  const weekEnd = useMemo(() => {
    const d = new Date(anchorMonday)
    d.setDate(anchorMonday.getDate() + 7)
    return d
  }, [anchorMonday])

  const events = useMemo(() => {
    const at = (dOffset, hour, min = 0) => {
      const d = new Date(anchorMonday)
      d.setDate(anchorMonday.getDate() + dOffset)
      d.setHours(hour, min, 0, 0)
      return d
    }

    return [
      {
        id: 'ev-hiit-mon',
        title: 'Pulse Protocol',
        start: at(0, 7, 0),
        end: at(0, 7, 45),
        extendedProps: {
          category: 'HIIT',
          trainer: 'Coach Vega',
          level: 'Advanced',
          details: 'Intervals designed to spike output and build resilience.',
        },
      },
      {
        id: 'ev-yoga-tue',
        title: 'Flex & Flow',
        start: at(1, 9, 0),
        end: at(1, 9, 50),
        extendedProps: {
          category: 'Yoga',
          trainer: 'Coach Luna',
          level: 'Beginner',
          details: 'Mobility, breathwork, and recovery-focused movement.',
        },
      },
      {
        id: 'ev-box-wed',
        title: 'Striker Series',
        start: at(2, 18, 0),
        end: at(2, 19, 0),
        extendedProps: {
          category: 'Boxing',
          trainer: 'Coach Knox',
          level: 'Intermediate',
          details: 'Technique + conditioning with pad work and combos.',
        },
      },
      {
        id: 'ev-str-thu',
        title: 'Iron Circuit',
        start: at(3, 17, 0),
        end: at(3, 17, 55),
        extendedProps: {
          category: 'Strength',
          trainer: 'Coach Nova',
          level: 'Intermediate',
          details: 'Compound lifts + density work. Build real strength.',
        },
      },
      {
        id: 'ev-card-sat',
        title: 'Engine Room',
        start: at(5, 9, 0),
        end: at(5, 9, 55),
        extendedProps: {
          category: 'Cardio',
          trainer: 'Coach Atlas',
          level: 'All',
          details: 'Sustainable intensity: row, run, bike, and sled.',
        },
      },
    ]
  }, [anchorMonday])

  const { ref: gridRef, inView: gridInView } = useInView({
    threshold: 0.12,
    triggerOnce: false,
  })
  const { ref: calRef, inView: calInView } = useInView({
    threshold: 0.12,
    triggerOnce: true,
  })

  const tabContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  }
  const tabItem = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
  }

  return (
    <div className="bg-dark text-white">
      {/* HERO */}
      <section className="relative h-[42vh] min-h-[300px] overflow-hidden bg-dark">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          referrerPolicy="no-referrer"
          onError={() => {
            setHeroBg((cur) => {
              if (cur !== HERO_BG_FALLBACK) return HERO_BG_FALLBACK
              if (cur !== placeholderBg) return placeholderBg
              return cur
            })
          }}
        />
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(110deg, rgba(10,10,10,0.86), rgba(10,10,10,0.56))`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-6 pb-8 pt-20">
          <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-white/70">
            <NavLink to="/" className="hover:text-primary">
              {t('classesPage.breadcrumbHome')}
            </NavLink>{' '}
            <span className="px-2 text-white/40">›</span>
            <span className="text-white/90">{t('classesPage.breadcrumbClasses')}</span>
          </div>
          <h1 className="mt-3 font-display text-5xl tracking-wide md:text-6xl">
            {t('classesPage.heroTitle')}
          </h1>
        </div>
      </section>

      {/* WEEKLY SCHEDULE */}
      <section ref={calRef} className="bg-dark py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={calInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="flex items-end justify-between gap-6"
          >
            <div>
              <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
                {t('classesPage.scheduleLabel')}
              </div>
              <h2 className="mt-3 font-display text-5xl tracking-wide text-white md:text-6xl">
                {t('classesPage.scheduleTitle')}
              </h2>
            </div>
            <div className="hidden items-center gap-2 text-white/70 md:flex">
              <span className="font-body text-xs uppercase tracking-widest">
                {t('classesPage.hintTapEvent')}
              </span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={calInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.06 }}
            className="mt-10 border border-border bg-surface p-3 md:p-4"
          >
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={anchorMonday}
              validRange={{ start: anchorMonday, end: weekEnd }}
              height="auto"
              nowIndicator
              allDaySlot={false}
              slotMinTime="06:00:00"
              slotMaxTime="20:00:00"
              slotDuration="01:00:00"
              slotLabelInterval="01:00"
              expandRows
              headerToolbar={false}
              navLinks={false}
              editable={false}
              eventStartEditable={false}
              eventDurationEditable={false}
              displayEventTime={false}
              dayHeaderContent={(arg) => {
                const locale = lang === 'fr' ? 'fr-FR' : 'en-US'
                return arg.date.toLocaleDateString(locale, { weekday: 'short' })
              }}
              events={events}
              eventClick={(arg) => {
                arg.jsEvent.preventDefault()
                setModalEvent(arg.event)
              }}
            />
          </motion.div>
        </div>

        <EventModal eventInfo={modalEvent} onClose={() => setModalEvent(null)} />
      </section>

      {/* CATEGORIES + GRID */}
      <section className="bg-dark py-14 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-8 sm:gap-10">
            <div>
              <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
                {t('classesPage.categoriesLabel')}
              </div>
              <div className="mt-6 overflow-x-auto">
                <motion.div
                  className="flex min-w-max items-center gap-8 border-b border-border pb-3"
                  variants={tabContainer}
                  initial="hidden"
                  animate="show"
                >
                  {(dict.classesPage?.tabs ?? TAB_KEYS).map((label, idx) => {
                    const key = TAB_KEYS[idx] ?? label
                    const activeNow = key === active
                    return (
                      <motion.button
                        key={key}
                        type="button"
                        variants={tabItem}
                        onClick={() => setActive(key)}
                        className={[
                          'relative pb-2 font-body text-xs font-semibold uppercase tracking-widest transition-colors',
                          activeNow ? 'text-primary' : 'text-white/75 hover:text-white',
                        ].join(' ')}
                      >
                        {label}
                        {activeNow && (
                          <motion.span
                            layoutId="classes-tab-underline"
                            className="absolute left-0 right-0 -bottom-[13px] h-[2px] bg-primary"
                            transition={{ type: 'spring', stiffness: 520, damping: 36 }}
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </motion.div>
              </div>
            </div>

            <div ref={gridRef}>
              <motion.div
                layout
                className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((c, idx) => (
                    <motion.article
                      key={c.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 14 }}
                      transition={{
                        type: 'spring',
                        stiffness: 320,
                        damping: 30,
                        delay: gridInView ? Math.min(0.22, idx * 0.04) : 0,
                      }}
                      className="group flex min-h-0 flex-col overflow-hidden border border-border bg-surface"
                    >
                      <div className="relative h-32 overflow-hidden sm:h-40 md:h-48">
                        <img
                          src={c.img}
                          alt={c.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (e.currentTarget.src !== CLASS_IMG_FALLBACK) {
                              e.currentTarget.src = CLASS_IMG_FALLBACK
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-dark/35 to-dark/15" />
                        <div className="absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center truncate bg-primary px-2 py-0.5 font-body text-[8px] font-semibold uppercase tracking-wider text-white sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-widest md:left-5 md:top-5">
                          {c.category}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-6">
                        <div className="font-display text-lg leading-tight tracking-wide text-white sm:text-2xl md:text-3xl">
                          {c.name}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-2">
                          <span className="border border-white/35 bg-dark/20 px-1.5 py-0.5 font-body text-[8px] font-semibold uppercase tracking-wide text-white/90 sm:px-2 sm:py-1 sm:text-[10px] sm:tracking-widest">
                            {c.duration}
                          </span>
                          <span
                            className={[
                              'border bg-dark/20 px-1.5 py-0.5 font-body text-[8px] font-semibold uppercase tracking-wide sm:px-2 sm:py-1 sm:text-[10px] sm:tracking-widest',
                              levelTone(c.level),
                            ].join(' ')}
                          >
                            {c.level}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-1 flex-col gap-2 sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                            <div className="hidden h-8 w-8 shrink-0 border border-primary/40 bg-primary/15 sm:block sm:h-9 sm:w-9" />
                            <div className="min-w-0">
                              <div className="truncate font-body text-[9px] font-semibold uppercase tracking-wide text-white sm:text-[11px] sm:tracking-widest">
                                {c.trainer}
                              </div>
                              <div className="font-body text-[9px] text-white/60 sm:text-xs">
                                {t('classesPage.trainerLabel')}
                              </div>
                            </div>
                          </div>
                          <div className="line-clamp-2 font-body text-[9px] leading-snug text-white/70 sm:text-right sm:text-xs">
                            {c.time}
                          </div>
                        </div>

                        <a
                          href={getWhatsAppUrl(t('whatsapp.classBook').replace('{class}', c.name))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex min-h-10 w-full items-center justify-center bg-primary px-3 py-2 font-body text-[9px] font-semibold uppercase tracking-wide text-white transition-transform active:scale-[0.98] hover:bg-accent sm:mt-6 sm:min-h-11 sm:px-6 sm:text-xs sm:tracking-widest sm:hover:scale-[1.02]"
                        >
                          {t('classesPage.bookNow')}
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

