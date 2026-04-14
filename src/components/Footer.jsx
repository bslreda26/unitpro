import { useI18n } from '../i18n/I18nProvider.jsx'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="relative overflow-hidden border-t border-primary/40 bg-gradient-to-b from-[#0c0c0c] via-dark to-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-primary/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-primary/[0.05] blur-2xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-12 md:pb-14 md:pt-16">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-[10px] sm:tracking-[0.35em]">
              {t('footer.contact')}
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.75rem,8vw,2.75rem)] leading-[0.95] tracking-wide text-white sm:mt-3 sm:text-[clamp(2.25rem,5vw,3.25rem)]">
              {t('footer.headline')}
            </h2>
            <p className="mt-2 max-w-md font-body text-xs leading-snug text-white/60 sm:mt-4 sm:text-sm sm:leading-relaxed md:text-base">
              {t('footer.sub')}
            </p>
          </div>
          <p className="hidden select-none font-display text-[clamp(3rem,8vw,7rem)] leading-none tracking-[0.08em] md:block lg:text-right">
            <span className="text-white/[0.08]">UNIT</span>
            <br />
            <span className="text-primary/25">PRO</span>
            <span className="ml-3 inline-block align-super font-body text-[0.15em] font-semibold uppercase tracking-[0.3em] text-white/35">
              STUDIO
            </span>
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-2 sm:mt-8 sm:grid-cols-4 sm:grid-rows-1 sm:gap-4 md:mt-10">
          <a
            className="group flex min-h-0 flex-col justify-center rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.25)] transition-all duration-300 active:bg-white/[0.06] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/[0.05] sm:min-h-[52px] sm:px-5 sm:py-4"
            href="mailto:hello@unitpro.com"
          >
            <div className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[10px] sm:tracking-[0.22em]">
              {t('footer.email')}
            </div>
            <div className="mt-1 flex items-start justify-between gap-1 sm:mt-2 sm:items-baseline sm:gap-2">
              <span className="min-w-0 break-all font-body text-[11px] leading-snug text-white/90 transition-colors group-hover:text-white sm:text-sm sm:break-normal sm:leading-normal">
                hello@unitpro.com
              </span>
              <span
                className="hidden shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:inline"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </a>

          <a
            className="group flex min-h-0 flex-col justify-center rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.25)] transition-all duration-300 active:bg-white/[0.06] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/[0.05] sm:min-h-[52px] sm:px-5 sm:py-4"
            href="tel:07000000"
          >
            <div className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[10px] sm:tracking-[0.22em]">
              {t('footer.phone')}
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-1 sm:mt-2 sm:gap-2">
              <span className="font-body text-[11px] text-white/90 transition-colors group-hover:text-white sm:text-sm">
                07000000
              </span>
              <span
                className="hidden shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:inline"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </a>

          <div className="flex min-h-0 flex-col justify-center rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2.5 shadow-[0_10px_26px_rgba(0,0,0,0.25)] sm:min-h-[52px] sm:px-5 sm:py-4">
            <div className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[10px] sm:tracking-[0.22em]">
              {t('footer.hours')}
            </div>
            <p className="mt-1 font-body text-[11px] leading-snug text-white/85 sm:mt-2 sm:text-sm">
              {t('footer.hoursValue')}
            </p>
          </div>
          <a
            className="group flex min-h-0 flex-col justify-center rounded-xl border border-primary/35 bg-primary/[0.08] px-3 py-2.5 shadow-[0_12px_28px_rgba(227,27,35,0.16)] transition-all duration-300 active:bg-primary/[0.14] hover:-translate-y-0.5 hover:bg-primary/[0.14] sm:min-h-[52px] sm:px-5 sm:py-4"
            href="https://www.google.com/maps/search/?api=1&query=Deux+Plateau+Abidjan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[10px] sm:tracking-[0.22em]">
              {t('footer.location')}
            </div>
            <div className="mt-1 flex items-center justify-between gap-2 sm:mt-2">
              <p className="font-body text-[11px] leading-snug text-white sm:text-sm">
                {t('footer.locationValue')}
              </p>
              <span
                className="shrink-0 text-primary opacity-80 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-4 pb-safe-bottom text-center sm:gap-3 sm:px-6 sm:py-6 md:flex-row md:justify-between md:text-left">
          <p className="order-2 font-body text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.2em] md:order-1">
            © {new Date().getFullYear()} UNIT <span className="text-primary/90">PRO</span>{' '}
            <span className="text-white/65">STUDIO</span> — {t('footer.rights')}
          </p>
          <p className="order-1 max-w-md font-body text-[11px] italic leading-snug text-white/55 sm:text-xs sm:leading-relaxed md:order-2 md:text-right">
            {t('footer.built')}
          </p>
        </div>
      </div>
    </footer>
  )
}
