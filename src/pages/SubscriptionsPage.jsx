import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'

const HERO_BG =
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=2400&q=80'

// Plans + FAQ are provided via i18n so they translate cleanly.

function Price({ value, suffix }) {
  const formatted = new Intl.NumberFormat('fr-FR').format(Number(value) || 0)
  return (
    <div className="flex items-end gap-2">
      <motion.div
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="font-display text-6xl leading-none tracking-wide text-white"
      >
        {formatted}
        <span className="ml-2 align-baseline font-body text-sm font-semibold uppercase tracking-widest text-white/75">
          FCFA
        </span>
      </motion.div>
      <div className="pb-1 font-body text-sm font-semibold uppercase tracking-widest text-white/70">
        {suffix}
      </div>
    </div>
  )
}

function BillingToggle({ billing, setBilling }) {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => setBilling('monthly')}
        className={[
          'relative inline-flex h-11 items-center justify-center px-5 font-body text-xs font-semibold uppercase tracking-widest transition-colors',
          billing === 'monthly'
            ? 'text-primary'
            : 'text-white/75 hover:text-white',
        ].join(' ')}
      >
        {t('subscriptions.monthly')}
      </button>

      <button
        type="button"
        onClick={() => setBilling('annual')}
        className={[
          'relative inline-flex h-11 items-center justify-center px-5 font-body text-xs font-semibold uppercase tracking-widest transition-colors',
          billing === 'annual' ? 'text-primary' : 'text-white/75 hover:text-white',
        ].join(' ')}
      >
        {t('subscriptions.annual')}
        <span className="ml-3 inline-flex items-center bg-primary/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
          {t('subscriptions.save')}
        </span>
      </button>

      <div className="relative ml-2 hidden h-11 w-32 border border-border bg-surface p-1 md:block">
        <motion.div
          layout
          className="absolute top-1 bottom-1 w-[calc(50%-6px)] bg-primary/15"
          initial={false}
          animate={{ left: billing === 'monthly' ? 4 : 'calc(50% + 2px)' }}
          transition={{ type: 'spring', stiffness: 520, damping: 36 }}
        />
        <div className="relative z-10 grid h-full grid-cols-2">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={[
              'font-body text-[10px] font-bold uppercase tracking-widest',
              billing === 'monthly' ? 'text-primary' : 'text-white/60',
            ].join(' ')}
          >
            Mo
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            className={[
              'font-body text-[10px] font-bold uppercase tracking-widest',
              billing === 'annual' ? 'text-primary' : 'text-white/60',
            ].join(' ')}
          >
            Yr
          </button>
        </div>
      </div>
    </div>
  )
}

function PlanCard({ plan, billing }) {
  const { t } = useI18n()
  const price = billing === 'annual' ? plan.annual : plan.monthly
  const suffix =
    billing === 'annual' ? t('subscriptions.suffixAnnual') : t('subscriptions.suffixMo')

  const base =
    'relative flex h-full flex-col overflow-hidden border border-border bg-surface p-7 md:p-8'
  const featured =
    'bg-[#1A0000] shadow-[0_30px_90px_rgba(227,27,35,0.15)]'

  const ctaClass = (() => {
    if (plan.cta.variant === 'outline')
      return 'border border-white/80 bg-transparent text-white hover:border-primary hover:text-primary'
    if (plan.cta.variant === 'solid')
      return 'bg-primary text-white hover:bg-accent hover:scale-[1.03]'
    return 'bg-white text-dark hover:scale-[1.03]'
  })()

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 320, damping: 28 },
        },
      }}
      className={[
        base,
        plan.featured ? featured : 'bg-surface',
        plan.featured ? 'md:-mt-2 md:scale-[1.02]' : '',
      ].join(' ')}
    >
      {plan.featured && (
        <>
          <div className="absolute left-0 top-0 h-[4px] w-full bg-primary" />
          <div className="absolute right-6 top-6 inline-flex items-center bg-primary/15 px-3 py-1 font-body text-[10px] font-bold uppercase tracking-widest text-primary">
            {t('subscriptions.mostPopular')}
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/25 blur-2xl" />
          </div>
        </>
      )}

      <div className="relative flex h-full flex-col">
        <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-white/70">
          {t('subscriptions.planLabel')}
        </div>
        <div className="mt-2 font-display text-5xl tracking-wide text-white">
          {plan.name}
        </div>

        <div className="mt-6">
          <Price value={price} suffix={suffix} />
        </div>

        <div className="mt-7 space-y-3">
          {plan.features.map((f) => (
            <div key={f} className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-5 w-5 items-center justify-center bg-primary/15">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div className="font-body text-sm text-white/85">{f}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={[
            'mt-auto inline-flex h-12 w-full items-center justify-center px-7 font-body text-xs font-semibold uppercase tracking-widest transition-transform',
            ctaClass,
          ].join(' ')}
        >
          {plan.cta.label}
        </button>
      </div>
    </motion.article>
  )
}

export function SubscriptionsPage() {
  const { dict, t } = useI18n()
  const [billing, setBilling] = useState('monthly') // 'monthly' | 'annual'

  const container = useMemo(
    () => ({
      hidden: {},
      show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
    }),
    [],
  )

  return (
    <div className="bg-dark text-white">
      {/* HERO */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-dark">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(110deg, rgba(10,10,10,0.88), rgba(10,10,10,0.58)), url(${HERO_BG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-6 pb-10 pt-24">
          <h1 className="font-display text-6xl tracking-wide md:text-7xl">
            {t('subscriptions.heroTitle')}
          </h1>
          <p className="mt-3 max-w-xl font-body text-base text-white/80 md:text-lg">
            {t('subscriptions.heroBody')}
          </p>
        </div>
      </section>

      {/* TOGGLE + PRICING */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="text-center">
            <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
              {t('subscriptions.billingLabel')}
            </div>
            <h2 className="mt-3 font-display text-5xl tracking-wide text-white md:text-6xl">
              {t('subscriptions.pricingTitle')}
            </h2>
          </div>

          <div className="mt-10">
            <BillingToggle billing={billing} setBilling={setBilling} />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-12 grid items-stretch gap-6 md:grid-cols-3"
          >
            {(dict.subscriptions?.plans ?? []).map((p) => (
              <PlanCard key={p.key} plan={p} billing={billing} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary py-16 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
          <div>
            <div className="font-display text-6xl leading-none tracking-wide md:text-7xl">
              {t('subscriptions.finalTitle')}
            </div>
            <div className="mt-3 max-w-xl font-body text-sm text-white/90 md:text-base">
              {t('subscriptions.finalBody')}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <NavLink
              to="/subscriptions"
              className="inline-flex h-12 items-center justify-center bg-white px-8 font-body text-xs font-semibold uppercase tracking-widest text-dark transition-transform hover:scale-[1.03]"
            >
              {t('subscriptions.claim')}
            </NavLink>
            <div className="font-body text-xs text-white/85">
              {t('subscriptions.offer')}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

