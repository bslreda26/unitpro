import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { getWhatsAppUrl } from '../utils/whatsapp.js'

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
        className="font-display text-4xl leading-none tracking-wide text-white sm:text-5xl md:text-6xl"
      >
        {formatted}
        <span className="ml-1 align-baseline font-body text-[10px] font-semibold uppercase tracking-widest text-white/75 sm:ml-2 sm:text-sm">
          FCFA
        </span>
      </motion.div>
      <div className="pb-0.5 font-body text-[10px] font-semibold uppercase tracking-widest text-white/70 sm:pb-1 sm:text-sm">
        {suffix}
      </div>
    </div>
  )
}

function BillingToggle({ billing, setBilling }) {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex w-full max-w-xl flex-wrap items-center justify-center gap-2 sm:gap-3">
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
        <span className="ml-1.5 inline-flex max-w-full items-center bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary sm:ml-3 sm:px-2 sm:py-1 sm:text-[10px] sm:tracking-widest">
          {t('subscriptions.save')}
        </span>
      </button>
    </div>
  )
}

function PlanCard({ plan, billing }) {
  const { t } = useI18n()
  const price = billing === 'annual' ? plan.annual : plan.monthly
  const suffix =
    billing === 'annual' ? t('subscriptions.suffixAnnual') : t('subscriptions.suffixMo')

  const base =
    'relative flex h-full min-h-0 flex-col overflow-hidden border border-border bg-surface p-4 sm:p-6 md:p-8'
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
          <div className="absolute right-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center truncate bg-primary/15 px-2 py-0.5 font-body text-[8px] font-bold uppercase tracking-wider text-primary sm:right-6 sm:top-6 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-widest">
            {t('subscriptions.mostPopular')}
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/25 blur-2xl" />
          </div>
        </>
      )}

      <div className="relative flex h-full flex-col">
        <div className="font-body text-[9px] font-semibold uppercase tracking-wider text-white/70 sm:text-[11px] sm:tracking-widest">
          {t('subscriptions.planLabel')}
        </div>
        <div className="mt-1 font-display text-2xl tracking-wide text-white sm:mt-2 sm:text-4xl md:text-5xl">
          {plan.name}
        </div>

        <div className="mt-4 sm:mt-6">
          <Price value={price} suffix={suffix} />
        </div>

        <div className="mt-4 space-y-2 sm:mt-7 sm:space-y-3">
          {plan.features.map((f) => (
            <div key={f} className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center bg-primary/15 sm:h-5 sm:w-5">
                <Check className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
              </div>
              <div className="min-w-0 font-body text-[11px] leading-snug text-white/85 sm:text-sm sm:leading-normal">
                {f}
              </div>
            </div>
          ))}
        </div>

        <a
          href={getWhatsAppUrl(t('whatsapp.plan').replace('{plan}', plan.name))}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'mt-4 inline-flex min-h-10 w-full items-center justify-center px-4 font-body text-[9px] font-semibold uppercase tracking-wide transition-transform active:scale-[0.98] sm:mt-auto sm:min-h-12 sm:px-7 sm:text-xs sm:tracking-widest sm:hover:scale-[1.02]',
            ctaClass,
          ].join(' ')}
        >
          {plan.cta.label}
        </a>
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

        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-4 pb-8 pt-24 sm:px-6 sm:pb-10">
          <h1 className="font-display text-[clamp(2.5rem,12vw,4rem)] tracking-wide md:text-7xl">
            {t('subscriptions.heroTitle')}
          </h1>
          <p className="mt-3 max-w-xl font-body text-sm text-white/80 sm:text-base md:text-lg">
            {t('subscriptions.heroBody')}
          </p>
        </div>
      </section>

      {/* TOGGLE + PRICING */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <div className="font-body text-[12px] font-semibold uppercase tracking-[0.26em] text-primary">
              {t('subscriptions.billingLabel')}
            </div>
            <h2 className="mt-3 font-display text-[clamp(2rem,8vw,3.75rem)] tracking-wide text-white md:text-6xl">
              {t('subscriptions.pricingTitle')}
            </h2>
          </div>

          <div className="mt-8 sm:mt-10">
            <BillingToggle billing={billing} setBilling={setBilling} />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-8 grid grid-cols-2 items-stretch gap-2.5 sm:mt-12 sm:gap-4 md:gap-6"
          >
            {(dict.subscriptions?.plans ?? []).map((p) => (
              <PlanCard key={p.key} plan={p} billing={billing} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA — compact trial strip */}
      <section className="border-t border-white/15 bg-primary py-10 text-white sm:py-12">
        <div className="mx-auto max-w-lg px-4 text-center sm:max-w-2xl sm:px-6 md:max-w-3xl">
          <h2 className="font-display text-3xl tracking-wide sm:text-4xl">
            {t('subscriptions.finalTitle')}
          </h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-white/90">
            {t('subscriptions.finalBody')}
          </p>
          <a
            href={getWhatsAppUrl(t('whatsapp.trialDay'))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 w-full max-w-xs items-center justify-center bg-white px-6 font-body text-xs font-semibold uppercase tracking-widest text-dark transition hover:opacity-90 sm:mx-auto sm:w-auto"
          >
            {t('subscriptions.claim')}
          </a>
          <p className="mt-3 font-body text-[11px] text-white/70">{t('subscriptions.offer')}</p>
        </div>
      </section>
    </div>
  )
}

