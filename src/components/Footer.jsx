import { useI18n } from '../i18n/I18nProvider.jsx'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t-2 border-primary bg-dark">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="font-body text-xs font-semibold uppercase tracking-widest text-white text-center">
            {t('footer.contact')}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="border border-border bg-surface px-5 py-4">
              <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-white/85">
                {t('footer.email')}
              </div>
              <a
                className="mt-2 block font-body text-sm text-white/70 transition-colors hover:text-primary"
                href="mailto:hello@unitpro.com"
              >
                hello@unitpro.com
              </a>
            </div>

            <div className="border border-border bg-surface px-5 py-4">
              <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-white/85">
                {t('footer.phone')}
              </div>
              <a
                className="mt-2 block font-body text-sm text-white/70 transition-colors hover:text-primary"
                href="tel:+15550122024"
              >
                (555) 012-2024
              </a>
            </div>

            <div className="border border-border bg-surface px-5 py-4">
              <div className="font-body text-[11px] font-semibold uppercase tracking-widest text-white/85">
                {t('footer.hours')}
              </div>
              <div className="mt-2 font-body text-sm text-white/70">Mon–Sun: 24/7 Access</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-6 text-center md:flex-row md:justify-between">
          <div className="font-body text-xs uppercase tracking-widest text-white/60">
            © {new Date().getFullYear()} UNIT PRO. {t('footer.rights')}
          </div>
          <div className="font-display text-2xl tracking-wide text-white/80">
            UNIT PRO
          </div>
          <div className="font-body text-xs uppercase tracking-widest text-white/60">
            {t('footer.built')}
          </div>
        </div>
      </div>
    </footer>
  )
}

