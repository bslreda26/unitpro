import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import FullCalendar from '@fullcalendar/react'
import frLocale from '@fullcalendar/core/locales/fr'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { ArrowRight, ChevronRight, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { WhatsAppLeadModal } from '../components/WhatsAppLeadModal.jsx'
import {
  buildClassInfoMap,
  catalogWithImages,
  durationMinutes,
  getGroupClasses,
} from '../data/groupClasses.js'

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

const TAB_KEYS = ['All', 'Strength', 'Cardio', 'HIIT', 'Conditioning', 'Recovery']
const CLASS_IMG_FALLBACK =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80'

/** [dayOffsetFromMonday, hour, minute, className] — powers calendar + mobile list */
const SWEAT60_SLOTS = [
  [0, 18, 30, 'Sweat60'],
  [2, 18, 30, 'Sweat60'],
  [4, 18, 30, 'Sweat60'],
]

const WEEKLY_SLOTS = [
  [0, 8, 30, 'Burn45'],
  [1, 8, 30, 'Strong Workout'],
  [2, 8, 30, 'Burn45'],
  [3, 8, 30, 'Strong Workout'],
  [4, 8, 30, 'Burn45'],
  [5, 8, 30, 'Booty & Legs Workout'],
  [0, 9, 15, 'Sculpt'],
  [2, 9, 15, 'Sculpt'],
  [4, 9, 15, 'Sculpt'],
  [1, 9, 30, 'HIIT Rush'],
  [3, 9, 30, 'HIIT Rush'],
  [5, 9, 30, 'Bootcamp'],
  [0, 12, 30, 'Express Burn'],
  [1, 12, 30, 'Core & Cardio'],
  [2, 12, 30, 'Express Burn'],
  [3, 12, 30, 'Core & Cardio'],
  [4, 12, 30, 'Express Burn'],
  [0, 17, 30, 'Strong Workout'],
  [1, 17, 30, 'Booty & Legs Workout'],
  [2, 17, 30, 'Strong Workout'],
  [3, 17, 30, 'Booty & Legs Workout'],
  [4, 17, 30, 'Strong Workout'],
  [5, 17, 30, 'Athletic Conditioning'],
  ...SWEAT60_SLOTS,
  [1, 18, 30, 'Burn45'],
  [3, 18, 30, 'Burn45'],
  [5, 18, 30, 'Stretch & Recovery'],
  [0, 19, 30, 'Small Group Coaching'],
  [1, 19, 30, 'Small Group Coaching'],
  [2, 19, 30, 'Small Group Coaching'],
  [3, 19, 30, 'Small Group Coaching'],
  [4, 19, 30, 'Small Group Coaching'],
]


function ClassDetailsBody({ classData, t, dict }) {
  if (!classData) return null
  const labels = dict.classesPage?.labels ?? {}

  return (
    <>
      <p className="font-body text-sm leading-relaxed text-white/80">{classData.description}</p>

      {classData.benefits?.length > 0 ? (
        <div className="mt-5">
          <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-primary">
            {labels.benefits}
          </div>
          <ul className="mt-2 space-y-1.5 font-body text-sm text-white/75">
            {classData.benefits.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {classData.note ? (
        <p className="mt-2 font-body text-xs text-white/50">{classData.note}</p>
      ) : null}

      {classData.idealFor?.items?.length > 0 ? (
        <div className="mt-5">
          <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-primary">
            {labels[classData.idealFor.label] ?? labels.idealFor}
          </div>
          <ul className="mt-2 space-y-1.5 font-body text-sm text-white/75">
            {classData.idealFor.items.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {classData.includes?.length > 0 ? (
        <div className="mt-5">
          <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-primary">
            {labels.includes}
          </div>
          <ul className="mt-2 space-y-1.5 font-body text-sm text-white/75">
            {classData.includes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}

/** Visual group for FullCalendar event styling (left accent + background). */
function categoryEventClass(category) {
  const c = (category || '').toLowerCase()
  if (c === 'cardio') return 'unit-fc-event--cardio'
  if (c === 'strength') return 'unit-fc-event--strength'
  if (c === 'hiit') return 'unit-fc-event--hiit'
  if (c === 'conditioning') return 'unit-fc-event--conditioning'
  if (c === 'recovery') return 'unit-fc-event--recovery'
  return 'unit-fc-event--default'
}

function formatEventTimeRange(start, end, locale) {
  if (!start || !end) return ''
  const opts = { hour: 'numeric', minute: '2-digit' }
  return `${start.toLocaleTimeString(locale, opts)} – ${end.toLocaleTimeString(locale, opts)}`
}

function categoryAccentClass(category) {
  const c = (category || '').toLowerCase()
  if (c === 'cardio') return 'bg-primary'
  if (c === 'strength') return 'bg-[#6b9dff]'
  if (c === 'hiit') return 'bg-[#ffb347]'
  if (c === 'conditioning') return 'bg-[#4fd1c5]'
  if (c === 'recovery') return 'bg-[#86efac]'
  return 'bg-white/35'
}

function dayOffsetFromWeekMonday(anchorMonday, eventStart) {
  const a = new Date(anchorMonday)
  a.setHours(0, 0, 0, 0)
  const d = new Date(eventStart)
  d.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - a.getTime()) / 86400000)
}

function MobileScheduleList({ events, anchorMonday, lang, onSelect }) {
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US'

  const byDay = useMemo(() => {
    const buckets = Array.from({ length: 6 }, () => [])
    for (const ev of events) {
      const idx = dayOffsetFromWeekMonday(anchorMonday, ev.start)
      if (idx >= 0 && idx < 6) buckets[idx].push(ev)
    }
    for (const b of buckets) {
      b.sort((x, y) => x.start.getTime() - y.start.getTime())
    }
    return buckets
  }, [events, anchorMonday])

  return (
    <div className="space-y-5">
      {byDay.map((dayEvents, d) => {
        if (dayEvents.length === 0) return null
        const dayDate = new Date(anchorMonday)
        dayDate.setDate(anchorMonday.getDate() + d)
        const dayTitle = dayDate.toLocaleDateString(locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })

        return (
          <section
            key={d}
            className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0a0a0a]"
          >
            <div className="border-b border-white/10 bg-white/[0.02] px-4 py-2.5 sm:px-5 sm:py-3">
              <h3 className="font-display text-lg capitalize tracking-wide text-white sm:text-xl">
                {dayTitle}
              </h3>
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {dayEvents.map((ev) => {
                const cat = ev.extendedProps?.category || ''
                const accent = categoryAccentClass(cat)
                const range = formatEventTimeRange(ev.start, ev.end, locale)
                return (
                  <li key={ev.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(ev)}
                      className="flex w-full items-stretch gap-0 text-left transition-colors hover:bg-white/[0.03] active:bg-white/[0.06]"
                    >
                      <div className={`w-1 shrink-0 self-stretch ${accent}`} aria-hidden />
                      <div className="flex min-h-[3.25rem] flex-1 items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5">
                        <div className="w-[5.25rem] shrink-0 whitespace-normal break-words font-body text-[11px] font-semibold leading-snug tracking-wide text-white/85 tabular-nums sm:w-24 sm:text-xs">
                          {range}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-display text-base leading-tight tracking-wide text-white sm:text-lg">
                            {ev.title}
                          </div>
                          <div className="mt-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-white/45 sm:text-[11px]">
                            {cat}
                          </div>
                        </div>
                        <ChevronRight
                          className="h-4 w-4 shrink-0 self-center text-white/30"
                          aria-hidden
                        />
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function ScheduleEventContent({ eventInfo, lang }) {
  const ev = eventInfo.event
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US'
  const range = formatEventTimeRange(ev.start, ev.end, locale)
  return (
    <div className="unit-fc-event-inner unit-fc-event-inner--compact">
      <div className="unit-fc-event-title">{ev.title}</div>
      <div className="unit-fc-event-time">{range}</div>
    </div>
  )
}

function ClassDetailModal({ classItem, onClose, onWhatsAppRequest, dict }) {
  const { t } = useI18n()
  if (!classItem) return null

  return (
    <AnimatePresence>
      {classItem && (
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
              'fixed inset-x-0 bottom-0 z-[60] w-full border border-border bg-surface p-5',
              'rounded-t-2xl',
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
                    {classItem.category}
                  </div>
                  <div className="mt-2 font-display text-3xl tracking-wide text-white sm:text-4xl">
                    {classItem.emoji ? `${classItem.emoji} ` : ''}
                    {classItem.name}
                  </div>
                  <div className="mt-2 font-body text-xs text-white/60">
                    {dict.classesPage?.labels?.level ?? 'Level'}: {classItem.level}
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

              <div className="mt-4 max-h-[55vh] overflow-auto pr-1 md:max-h-[min(70vh,520px)] md:pr-0">
                <ClassDetailsBody classData={classItem} t={t} dict={dict} />
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() =>
                    onWhatsAppRequest?.(
                      t('whatsapp.classBook').replace('{class}', classItem.name ?? ''),
                    )
                  }
                  className="inline-flex h-11 w-full items-center justify-center bg-primary px-6 font-body text-xs font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] hover:bg-accent"
                >
                  {t('classesPage.bookNow')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const VIEW_KEYS = ['calendar', 'classes']

function levelTone(level) {
  const v = level.toLowerCase()
  if (v.includes('beginner') || v.includes('débutant')) return 'border-emerald-400/40 text-emerald-200'
  if (v.includes('advanced') || v.includes('avancé')) return 'border-primary/50 text-primary'
  if (v.includes('intermediate') || v.includes('intermédiaire')) {
    return 'border-amber-400/35 text-amber-100'
  }
  return 'border-white/35 text-white/90'
}

function EventModal({ eventInfo, onClose, onWhatsAppRequest, dict }) {
  const { t } = useI18n()
  const classData = eventInfo?.extendedProps?.classData
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
                    {classData?.emoji ? `${classData.emoji} ` : ''}
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

              <div className="mt-3 max-h-[55vh] overflow-auto pr-1 md:max-h-[min(70vh,520px)] md:pr-0">
                {classData ? (
                  <ClassDetailsBody classData={classData} t={t} dict={dict} />
                ) : (
                  <div className="font-body text-sm text-white/80">
                    {eventInfo.extendedProps.details || t('classesPage.modal.detailsFallback')}
                  </div>
                )}

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
                <button
                  type="button"
                  onClick={() =>
                    onWhatsAppRequest?.(
                      t('whatsapp.classBook').replace('{class}', eventInfo.title ?? ''),
                    )
                  }
                  className="inline-flex h-11 w-full items-center justify-center bg-primary px-6 font-body text-xs font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] hover:bg-accent md:w-auto md:justify-end"
                >
                  {t('classesPage.bookNow')}
                </button>
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
  const [viewMode, setViewMode] = useState('calendar')
  const [active, setActive] = useState('All')
  const [modalEvent, setModalEvent] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [whatsAppMessage, setWhatsAppMessage] = useState('')
  const [whatsAppOpen, setWhatsAppOpen] = useState(false)
  const placeholderBg = useSvgPlaceholderDataUrl()
  const [heroBg, setHeroBg] = useState(HERO_BG_PRIMARY)

  const classes = useMemo(
    () => catalogWithImages(getGroupClasses(lang).catalog),
    [lang],
  )

  const classInfoMap = useMemo(() => buildClassInfoMap(lang), [lang])

  const filtered = useMemo(() => {
    if (active === 'All') return classes
    return classes.filter((c) => c.category === active)
  }, [active, classes])

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
    d.setHours(0, 0, 0, 0)
    return d
  }, [anchorMonday])

  const events = useMemo(() => {
    const at = (dOffset, hour, min = 0) => {
      const d = new Date(anchorMonday)
      d.setDate(anchorMonday.getDate() + dOffset)
      d.setHours(hour, min, 0, 0)
      return d
    }

    return WEEKLY_SLOTS.map(([dOffset, hour, minute, title], idx) => {
      const start = at(dOffset, hour, minute)
      const end = new Date(start)
      end.setMinutes(end.getMinutes() + durationMinutes(title, hour, minute))
      const info = classInfoMap[title] ?? {
        category: 'Strength',
        level: 'All levels',
        trainer: 'UNIT PRO Coach',
        details: 'Studio class — tap Book for WhatsApp.',
      }
      return {
        id: `ev-${dOffset}-${hour}-${minute}-${title}-${idx}`,
        title,
        start,
        end,
        classNames: ['unit-fc-event', categoryEventClass(info.category)],
        extendedProps: {
          category: info.category,
          trainer: info.trainer,
          level: info.level,
          details: info.details,
          classData: info.classData,
        },
      }
    })
  }, [anchorMonday, classInfoMap])

  const { ref: contentRef, inView: contentInView } = useInView({
    threshold: 0.08,
    triggerOnce: true,
  })
  const { ref: gridRef, inView: gridInView } = useInView({
    threshold: 0.12,
    triggerOnce: false,
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
        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-4 pb-6 pt-20 sm:px-6 sm:pb-8">
          <div className="font-body text-[10px] font-semibold uppercase tracking-widest text-white/70 sm:text-[11px]">
            <NavLink to="/" className="hover:text-primary">
              {t('classesPage.breadcrumbHome')}
            </NavLink>{' '}
            <span className="px-2 text-white/40">›</span>
            <span className="text-white/90">{t('classesPage.breadcrumbClasses')}</span>
          </div>
          <h1 className="mt-3 text-balance font-display text-[clamp(2rem,9vw,3.75rem)] tracking-wide md:text-6xl">
            {t('classesPage.heroTitle')}
          </h1>
        </div>
      </section>

      {/* CALENDAR / CLASSES TOGGLE */}
      <section ref={contentRef} className="bg-dark py-12 sm:py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div
            className="flex gap-2 sm:justify-center sm:gap-3"
            role="tablist"
            aria-label={t('classesPage.heroTitle')}
          >
            {VIEW_KEYS.map((key) => {
              const activeView = viewMode === key
              const label =
                key === 'calendar'
                  ? t('classesPage.viewCalendar')
                  : t('classesPage.viewClasses')
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeView}
                  onClick={() => setViewMode(key)}
                  className={[
                    'min-h-11 flex-1 px-4 font-body text-[10px] font-semibold uppercase tracking-wide transition sm:min-h-12 sm:min-w-[10.5rem] sm:flex-none sm:px-8 sm:text-xs sm:tracking-widest',
                    activeView
                      ? 'bg-primary text-white'
                      : 'border border-white/25 bg-transparent text-white/80 hover:border-primary/50 hover:text-white',
                  ].join(' ')}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <div className="mt-8 min-h-[240px] sm:mt-10 sm:min-h-[320px]" role="tabpanel">
            <AnimatePresence mode="wait">
              {viewMode === 'calendar' ? (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={contentInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="max-w-3xl"
                  >
                    <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
                      {t('classesPage.scheduleLabel')}
                    </div>
                    <h2 className="mt-3 font-display text-[clamp(2rem,8vw,3.75rem)] leading-tight tracking-wide text-white md:text-6xl">
                      {t('classesPage.scheduleTitle')}
                    </h2>
                  </motion.div>

                  <div className="mt-8 md:mt-10">
                    <motion.div
                      className="md:hidden"
                      initial={{ opacity: 0, y: 12 }}
                      animate={contentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    >
                      <MobileScheduleList
                        events={events}
                        anchorMonday={anchorMonday}
                        lang={lang}
                        onSelect={setModalEvent}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={contentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.06 }}
                      className="hidden md:block"
                    >
                      <div className="mb-3 flex items-center justify-end gap-2 text-white/55">
                        <span className="font-body text-[11px] uppercase tracking-widest">
                          {t('classesPage.hintTapEvent')}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#080808]">
                        <div className="unit-weekly-calendar px-2 pb-2 pt-3 md:px-3 md:pb-3 md:pt-4">
                          <FullCalendar
                            key={anchorMonday.toISOString()}
                            plugins={[timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            initialDate={anchorMonday}
                            firstDay={1}
                            hiddenDays={[0]}
                            validRange={{ start: anchorMonday, end: weekEnd }}
                            height="auto"
                            locales={[frLocale]}
                            locale={lang === 'fr' ? 'fr' : 'en'}
                            nowIndicator
                            allDaySlot={false}
                            slotMinTime="08:00:00"
                            slotMaxTime="21:00:00"
                            slotDuration="00:30:00"
                            slotLabelInterval="01:00"
                            expandRows
                            headerToolbar={false}
                            navLinks={false}
                            editable={false}
                            eventStartEditable={false}
                            eventDurationEditable={false}
                            displayEventTime={false}
                            eventMinHeight={26}
                            dayHeaderContent={(arg) => {
                              const locale = lang === 'fr' ? 'fr-FR' : 'en-US'
                              const dow = arg.date.toLocaleDateString(locale, { weekday: 'short' })
                              const dom = arg.date.getDate()
                              const isSat = arg.date.getDay() === 6
                              return (
                                <div
                                  className={[
                                    'unit-fc-day-head',
                                    isSat ? 'unit-fc-day-head--sat' : '',
                                  ].join(' ')}
                                >
                                  <span className="unit-fc-day-head__dow">{dow}</span>
                                  <span className="unit-fc-day-head__dom">{dom}</span>
                                </div>
                              )
                            }}
                            slotLabelContent={(arg) => {
                              const d = arg.date
                              const locale = lang === 'fr' ? 'fr-FR' : 'en-US'
                              return (
                                <span className="unit-fc-slot-label">
                                  {d.toLocaleTimeString(locale, {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )
                            }}
                            slotLaneClassNames={(arg) => {
                              const m = arg.date.getMinutes()
                              return m === 0 ? ['unit-fc-slot-lane-hour'] : ['unit-fc-slot-lane-half']
                            }}
                            events={events}
                            eventContent={(arg) => (
                              <ScheduleEventContent eventInfo={arg} lang={lang} />
                            )}
                            eventClick={(arg) => {
                              arg.jsEvent.preventDefault()
                              setModalEvent(arg.event)
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="classes"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-8 sm:gap-10"
                >
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
                                  layoutId="classes-category-underline"
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
                      className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3"
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
                                {c.emoji ? `${c.emoji} ` : ''}
                                {c.name}
                              </div>
                              <p className="mt-2 line-clamp-3 font-body text-[11px] leading-snug text-white/65 sm:text-sm">
                                {c.description}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-2">
                                <span className="border border-white/35 bg-dark/20 px-1.5 py-0.5 font-body text-[8px] font-semibold uppercase tracking-wide text-white/90 sm:px-2 sm:py-1 sm:text-[10px] sm:tracking-widest">
                                  {c.durationLabel}
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

                              <div className="mt-3 font-body text-[9px] leading-snug text-white/70 sm:text-xs">
                                {c.time}
                              </div>

                              <div className="mt-3 flex flex-col gap-2 sm:mt-5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedClass(c)}
                                  className="inline-flex min-h-10 w-full items-center justify-center border border-white/25 bg-transparent px-3 py-2 font-body text-[9px] font-semibold uppercase tracking-wide text-white transition-colors hover:border-primary/50 hover:text-primary sm:min-h-11 sm:px-6 sm:text-xs sm:tracking-widest"
                                >
                                  {t('classesPreview.viewClass')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWhatsAppMessage(
                                      t('whatsapp.classBook').replace('{class}', c.name),
                                    )
                                    setWhatsAppOpen(true)
                                  }}
                                  className="inline-flex min-h-10 w-full items-center justify-center bg-primary px-3 py-2 font-body text-[9px] font-semibold uppercase tracking-wide text-white transition-transform active:scale-[0.98] hover:bg-accent sm:min-h-11 sm:px-6 sm:text-xs sm:tracking-widest sm:hover:scale-[1.02]"
                                >
                                  {t('classesPage.bookNow')}
                                </button>
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <EventModal
          eventInfo={modalEvent}
          dict={dict}
          onClose={() => setModalEvent(null)}
          onWhatsAppRequest={(message) => {
            setWhatsAppMessage(message)
            setWhatsAppOpen(true)
            setModalEvent(null)
          }}
        />
        <ClassDetailModal
          classItem={selectedClass}
          dict={dict}
          onClose={() => setSelectedClass(null)}
          onWhatsAppRequest={(message) => {
            setWhatsAppMessage(message)
            setWhatsAppOpen(true)
            setSelectedClass(null)
          }}
        />
      </section>
      <WhatsAppLeadModal
        open={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
        initialMessage={whatsAppMessage}
      />
    </div>
  )
}

