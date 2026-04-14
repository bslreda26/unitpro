import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'
import { getWhatsAppUrl } from '../utils/whatsapp.js'

const PHONE_PREFIX = '+225'

function normalizePhone(value) {
  return value.replace(/[^\d]/g, '')
}

export function WhatsAppLeadModal({ open, onClose, initialMessage = '' }) {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!open) return
    setTouched(false)
  }, [open])

  const isValid = useMemo(() => {
    const cleanPhone = normalizePhone(phone)
    return name.trim().length >= 2 && email.trim().includes('@') && cleanPhone.length >= 8
  }, [email, name, phone])

  const handleSubmit = (event) => {
    event.preventDefault()
    setTouched(true)
    if (!isValid) return

    const cleanPhone = normalizePhone(phone)
    const payload = [
      `${t('whatsappForm.nameLabel')}: ${name.trim()}`,
      `${t('whatsappForm.emailLabel')}: ${email.trim()}`,
      `${t('whatsappForm.phoneLabel')}: ${PHONE_PREFIX}${cleanPhone}`,
      '',
      initialMessage.trim(),
    ]
      .filter(Boolean)
      .join('\n')

    window.open(getWhatsAppUrl(payload), '_blank', 'noopener,noreferrer')
    onClose?.()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[90] bg-black/70"
            aria-label={t('whatsappForm.close')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-[100] max-h-[85svh] overflow-y-auto rounded-t-2xl border border-border bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:inset-x-0 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[92vw] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[min(90svh,42rem)] sm:rounded-none sm:p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
            <div className="flex items-start justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center border border-border bg-dark/30 text-white/80 hover:text-white"
                aria-label={t('whatsappForm.close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 pb-1 sm:mt-5">
              <label className="block">
                <span className="mb-1 block font-body text-[11px] font-semibold uppercase tracking-widest text-white/75">
                  {t('whatsappForm.nameLabel')}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full border border-border bg-dark/40 px-3 font-body text-sm text-white outline-none transition focus:border-primary"
                  placeholder={t('whatsappForm.namePlaceholder')}
                />
              </label>

              <label className="block">
                <span className="mb-1 block font-body text-[11px] font-semibold uppercase tracking-widest text-white/75">
                  {t('whatsappForm.emailLabel')}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full border border-border bg-dark/40 px-3 font-body text-sm text-white outline-none transition focus:border-primary"
                  placeholder={t('whatsappForm.emailPlaceholder')}
                />
              </label>

              <label className="block">
                <span className="mb-1 block font-body text-[11px] font-semibold uppercase tracking-widest text-white/75">
                  {t('whatsappForm.phoneLabel')}
                </span>
                <div className="flex h-11 w-full overflow-hidden border border-border bg-dark/40 focus-within:border-primary">
                  <span className="inline-flex items-center border-r border-border px-3 font-body text-sm font-semibold text-white/80">
                    {PHONE_PREFIX}
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-full w-full bg-transparent px-3 font-body text-sm text-white outline-none"
                    placeholder={t('whatsappForm.phonePlaceholder')}
                    inputMode="numeric"
                  />
                </div>
              </label>

              {touched && !isValid && (
                <p className="font-body text-xs text-primary">{t('whatsappForm.validation')}</p>
              )}

              <button
                type="submit"
                className="mt-2 inline-flex h-11 w-full items-center justify-center bg-primary px-5 font-body text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-accent"
              >
                {t('whatsappForm.submit')}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
