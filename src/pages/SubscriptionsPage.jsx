import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { PricingPackagesSection } from '../components/subscriptions/PricingPackagesSection.jsx'
import { WhatsAppLeadModal } from '../components/WhatsAppLeadModal.jsx'

const HERO_BG =
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=2400&q=80'

export function SubscriptionsPage() {
  const { t } = useI18n()
  const [whatsAppMessage, setWhatsAppMessage] = useState('')
  const [whatsAppOpen, setWhatsAppOpen] = useState(false)

  return (
    <div className="bg-dark text-white">
      <section className="relative h-[32vh] min-h-[220px] overflow-hidden bg-dark sm:h-[36vh] sm:min-h-[260px]">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(10,10,10,0.9), rgba(10,10,10,0.55)), url(${HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative mx-auto flex h-full w-full max-w-6xl items-end px-4 pb-6 pt-20 sm:px-6 sm:pb-8">
          <p className="max-w-xl font-body text-sm text-white/75 sm:text-base">
            {t('subscriptions.heroBody')}
          </p>
        </div>
      </section>

      <PricingPackagesSection />

      <section className="border-t border-white/15 bg-primary py-10 text-white sm:py-12">
        <div className="mx-auto max-w-lg px-4 text-center sm:max-w-2xl sm:px-6 md:max-w-3xl">
          <h2 className="font-display text-3xl tracking-wide sm:text-4xl">
            {t('subscriptions.finalTitle')}
          </h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-white/90">
            {t('subscriptions.finalBody')}
          </p>
          <button
            type="button"
            onClick={() => {
              setWhatsAppMessage(t('whatsapp.trialDay'))
              setWhatsAppOpen(true)
            }}
            className="mt-6 inline-flex min-h-11 w-full max-w-xs items-center justify-center bg-white px-6 font-body text-xs font-semibold uppercase tracking-widest text-dark transition hover:opacity-90 sm:mx-auto sm:w-auto"
          >
            {t('subscriptions.claim')}
          </button>
          <p className="mt-3 font-body text-[11px] text-white/70">{t('subscriptions.offer')}</p>
        </div>
      </section>

      <WhatsAppLeadModal
        open={whatsAppOpen}
        onClose={() => setWhatsAppOpen(false)}
        initialMessage={whatsAppMessage}
      />
    </div>
  )
}
