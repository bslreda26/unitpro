import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Gift, Sparkles } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useI18n } from '../../i18n/I18nProvider.jsx'
import { WhatsAppLeadModal } from '../WhatsAppLeadModal.jsx'

const TAB_KEYS = ['membership', 'groupClasses', 'personalTraining']

const money = new Intl.NumberFormat('fr-FR')

function formatFcfa(n) {
  return money.format(Number(n) || 0)
}

function PriceRow({ price, suffix = '' }) {
  return (
    <div className="mt-4 flex flex-wrap items-end gap-x-2 gap-y-1 border-t border-white/10 pt-4">
      <span className="font-display text-[clamp(1.65rem,3.8vw,2.35rem)] leading-none tracking-[0.04em] text-white tabular-nums">
        {formatFcfa(price)}
      </span>
      <span className="pb-0.5 font-body text-[9px] font-semibold uppercase tracking-widest text-white/75 sm:text-[10px]">
        FCFA
      </span>
      {suffix ? (
        <span className="pb-0.5 font-body text-[9px] font-semibold uppercase tracking-widest text-white/55 sm:text-[10px]">
          {suffix}
        </span>
      ) : null}
    </div>
  )
}

function MembershipPlanCard({ item, isFeatured, labels, onSelect }) {
  const ctaClass = (variant) => {
    if (variant === 'solid')
      return 'bg-primary text-white hover:bg-accent hover:scale-[1.02]'
    return 'border border-white/80 bg-transparent text-white hover:border-primary hover:text-primary'
  }

  const base =
    'relative flex h-full min-h-0 flex-col border border-border bg-surface p-4 sm:p-5 md:p-6'
  const featured =
    'border-primary/50 bg-[#1A0000] shadow-[0_30px_90px_rgba(227,27,35,0.12)] ring-1 ring-primary/25'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className={[base, isFeatured ? featured : ''].join(' ')}
    >
      {isFeatured ? (
        <>
          <div className="absolute left-0 top-0 h-[3px] w-full bg-primary" />
          <div className="pointer-events-none absolute inset-0 opacity-35">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-2xl" />
          </div>
        </>
      ) : null}

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="font-body text-[9px] font-semibold uppercase tracking-wider text-white/70 sm:text-[10px]">
          {labels.choosePlan}
        </div>
        <h3 className="mt-1 break-words font-display text-[clamp(1.15rem,4vw,1.75rem)] leading-tight tracking-wide text-white">
          {item.name}
        </h3>
        {item.subtitle ? (
          <p className="mt-1 font-body text-[11px] text-white/65 sm:text-xs">{item.subtitle}</p>
        ) : null}

        <PriceRow price={item.price} suffix={item.suffix} />

        <ul className="mt-4 flex-1 space-y-2 sm:mt-5">
          {(item.features ?? []).map((f) => (
            <li key={f} className="flex items-start gap-2">
              <div className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center bg-primary/15">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="font-body text-[11px] leading-snug text-white/85 sm:text-sm">{f}</span>
            </li>
          ))}
        </ul>

        {item.bestFor ? (
          <p className="mt-4 font-body text-[11px] leading-snug text-white/60 sm:text-xs">
            <span className="font-semibold uppercase tracking-wider text-primary/90">
              {labels.bestFor}
            </span>{' '}
            {item.bestFor}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => onSelect(item.name)}
          className={[
            'mt-6 inline-flex min-h-10 w-full items-center justify-center px-3 font-body text-[9px] font-semibold uppercase tracking-wide transition-transform active:scale-[0.98] sm:mt-7 sm:min-h-11 sm:text-[10px] sm:tracking-widest',
            ctaClass(item.cta?.variant),
          ].join(' ')}
        >
          {item.cta?.label ?? labels.choosePlan}
        </button>
      </div>
    </motion.article>
  )
}

function PackageCard({ item, bookLabel, onSelect }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="flex h-full flex-col border border-border bg-[#101010] p-4 sm:p-5 md:p-6"
    >
      <h3 className="break-words font-display text-base tracking-wide text-white sm:text-xl">{item.name}</h3>
      {item.description ? (
        <p className="mt-2 font-body text-[11px] leading-snug text-white/70 sm:text-sm">
          {item.description}
        </p>
      ) : null}
      {item.price != null ? <PriceRow price={item.price} suffix={item.suffix} /> : null}
      <button
        type="button"
        onClick={() => onSelect(item.name)}
        className="mt-auto inline-flex min-h-10 w-full items-center justify-center border border-white/70 bg-transparent px-3 pt-6 font-body text-[9px] font-semibold uppercase tracking-wide text-white transition hover:border-primary hover:text-primary sm:text-[10px]"
      >
        {bookLabel}
      </button>
    </motion.article>
  )
}

function OfferCard({ item }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col border border-primary/30 bg-primary/5 p-5 sm:p-6"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
        <Gift className="h-5 w-5 text-primary" />
      </div>
      <h3 className="mt-4 font-display text-xl tracking-wide text-white">{item.name}</h3>
      {item.description ? (
        <p className="mt-2 font-body text-sm leading-relaxed text-white/75">{item.description}</p>
      ) : null}
    </motion.article>
  )
}

export function PricingPackagesSection() {
  const { dict, t } = useI18n()
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })
  const [activeTab, setActiveTab] = useState('membership')
  const [whatsAppMessage, setWhatsAppMessage] = useState('')
  const [whatsAppOpen, setWhatsAppOpen] = useState(false)

  const hp = dict.homePricing ?? {}
  const plans = hp.plans ?? []
  const dayPass = hp.dayPass
  const groupItems = hp.groupClasses?.items ?? []
  const ptItems = hp.personalTraining?.items ?? []
  const offers = hp.specialOffers?.items ?? []
  const tabs = hp.tabs ?? {}

  const labels = useMemo(
    () => ({
      choosePlan: t('homePricing.choosePlan'),
      bestFor: t('homePricing.bestFor'),
      bookNow: t('homePricing.bookNow'),
    }),
    [t],
  )

  const tabLabels = useMemo(
    () => ({
      membership: tabs.membership ?? t('homePricing.tabs.membership'),
      groupClasses: tabs.groupClasses ?? t('homePricing.tabs.groupClasses'),
      personalTraining: tabs.personalTraining ?? t('homePricing.tabs.personalTraining'),
    }),
    [tabs, t],
  )

  const tabLabelsShort = useMemo(
    () => ({
      membership: hp.tabsShort?.membership ?? t('homePricing.tabsShort.membership'),
      groupClasses: hp.tabsShort?.groupClasses ?? t('homePricing.tabsShort.groupClasses'),
      personalTraining: hp.tabsShort?.personalTraining ?? t('homePricing.tabsShort.personalTraining'),
    }),
    [hp.tabsShort, t],
  )

  const openWhatsApp = (name) => {
    setWhatsAppMessage(t('whatsapp.plan').replace('{plan}', name))
    setWhatsAppOpen(true)
  }

  const membershipItems = useMemo(() => {
    const list = []
    if (dayPass) list.push({ ...dayPass, featured: false })
    return [...list, ...plans]
  }, [dayPass, plans])

  return (
    <section id="packages" ref={ref} className="relative bg-dark py-10 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          <div className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-[12px] sm:tracking-[0.26em]">
            {t('homePricing.label')}
          </div>
          <h2 className="mt-3 text-balance font-display text-[clamp(1.75rem,7vw,3.5rem)] leading-tight tracking-wide text-white md:text-5xl">
            {t('homePricing.title')}
          </h2>
        </motion.div>

        <div
          className="-mx-4 mt-8 touch-pan-x overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:mt-12 sm:overflow-visible sm:px-0"
          role="tablist"
          aria-label={t('homePricing.title')}
        >
          <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap sm:justify-center sm:gap-3">
            {TAB_KEYS.map((key) => {
              const active = activeTab === key
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(key)}
                  className={[
                    'min-h-11 shrink-0 snap-center px-4 font-body text-[10px] font-semibold uppercase leading-tight tracking-wide transition sm:min-h-12 sm:min-w-[10.5rem] sm:px-5 sm:text-xs sm:tracking-widest',
                    active
                      ? 'bg-primary text-white'
                      : 'border border-white/25 bg-transparent text-white/80 hover:border-primary/50 hover:text-white',
                  ].join(' ')}
                >
                  <span className="sm:hidden">{tabLabelsShort[key]}</span>
                  <span className="hidden sm:inline">{tabLabels[key]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 min-h-[200px] sm:mt-12 sm:min-h-[280px]" role="tabpanel">
          <AnimatePresence mode="wait">
            {activeTab === 'membership' ? (
              <motion.div
                key="membership"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 items-stretch gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              >
                {membershipItems.map((item) => (
                  <MembershipPlanCard
                    key={item.key ?? item.name}
                    item={item}
                    isFeatured={Boolean(item.featured)}
                    labels={labels}
                    onSelect={openWhatsApp}
                  />
                ))}
              </motion.div>
            ) : null}

            {activeTab === 'groupClasses' ? (
              <motion.div
                key="groupClasses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {groupItems.map((item) => (
                  <PackageCard
                    key={item.key}
                    item={item}
                    bookLabel={labels.bookNow}
                    onSelect={openWhatsApp}
                  />
                ))}
              </motion.div>
            ) : null}

            {activeTab === 'personalTraining' ? (
              <motion.div
                key="personalTraining"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {ptItems.map((item) => (
                  <PackageCard
                    key={item.key}
                    item={item}
                    bookLabel={labels.bookNow}
                    onSelect={openWhatsApp}
                  />
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {offers.length > 0 ? (
          <div className="mt-14 border-t border-white/10 pt-12 sm:mt-16">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-balance text-center font-display text-xl tracking-wide text-white sm:text-3xl">
                {hp.specialOffers?.label}
              </h3>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {offers.map((item) => (
                <OfferCard key={item.key} item={item} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              setWhatsAppMessage(t('whatsapp.heroSubscriptions'))
              setWhatsAppOpen(true)
            }}
            className="inline-flex min-h-12 w-full max-w-md items-center justify-center bg-primary px-6 font-body text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-accent sm:w-auto sm:px-8"
          >
            {t('homePricing.cta')}
          </button>
        </div>
      </div>

      <WhatsAppLeadModal
        open={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
        initialMessage={whatsAppMessage}
      />
    </section>
  )
}
