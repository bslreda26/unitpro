import { useI18n } from '../i18n/I18nProvider.jsx'

const VARIANTS = {
  nav: {
    root: 'inline-flex flex-col items-start',
    main: 'font-logo text-[clamp(1.35rem,4vw,1.85rem)] font-black uppercase leading-[0.92] tracking-[0.02em]',
    tagline: 'mt-0.5 font-body text-[6px] font-light uppercase tracking-[0.48em] text-white/90 sm:text-[7px] sm:tracking-[0.52em]',
    showTagline: false,
    defaultUnitClass: 'text-primary',
    defaultProClass: 'text-primary',
  },
  hero: {
    root: 'inline-flex flex-col items-center text-center',
    main: 'font-logo text-[clamp(2.75rem,14vw,5rem)] font-black uppercase leading-[0.9] tracking-[0.02em] sm:text-7xl md:text-8xl',
    tagline: 'mt-2 font-body text-[9px] font-light uppercase tracking-[0.55em] text-white sm:mt-3 sm:text-[10px] sm:tracking-[0.62em]',
    showTagline: true,
    defaultUnitClass: 'text-primary',
    defaultProClass: 'text-primary',
  },
  badge: {
    root: 'inline-flex flex-col items-start',
    main: 'font-logo text-[11px] font-black uppercase leading-none tracking-[0.02em] sm:text-xs',
    tagline: 'mt-px font-body text-[5px] font-light uppercase tracking-[0.35em] text-white/85',
    showTagline: true,
    defaultUnitClass: 'text-primary',
    defaultProClass: 'text-primary',
  },
  watermark: {
    root: 'inline-flex flex-col items-end text-right',
    main: 'font-logo text-[clamp(3.5rem,12vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[0.02em]',
    tagline: 'mt-1 font-body text-[10px] font-light uppercase tracking-[0.55em]',
    showTagline: true,
    defaultUnitClass: 'text-primary/25',
    defaultProClass: 'text-primary/25',
  },
}

export function LogoWordmark({
  variant = 'nav',
  unitClassName,
  proClassName,
  taglineClassName,
  className = '',
}) {
  const { t } = useI18n()
  const config = VARIANTS[variant] ?? VARIANTS.nav
  const tagline = t('logo.tagline')
  const unitClass = unitClassName ?? config.defaultUnitClass
  const proClass = proClassName ?? config.defaultProClass

  return (
    <span className={[config.root, className].filter(Boolean).join(' ')} aria-label="UNIT PRO">
      <span className={config.main}>
        <span className={unitClass}>UNIT</span>
        <span className={proClass}>PRO</span>
      </span>
      {config.showTagline && tagline && !tagline.startsWith('logo.') ? (
        <span className={[config.tagline, taglineClassName].filter(Boolean).join(' ')}>
          {tagline}
        </span>
      ) : null}
    </span>
  )
}
