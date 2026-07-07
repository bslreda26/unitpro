import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nProvider.jsx'

const NAV_LINKS = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.classes', to: '/classes' },
  { key: 'nav.subscriptions', to: '/subscriptions' },
]

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

function DesktopNav({ hovered, setHovered }) {
  const { t } = useI18n()
  return (
    <nav className="hidden items-center justify-center gap-10 md:flex">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            [
              'relative py-2 font-body text-[11px] uppercase tracking-widest text-white/90 transition-colors',
              isActive ? 'text-white' : 'hover:text-white',
            ].join(' ')
          }
          onMouseEnter={() => setHovered(link.to)}
          onMouseLeave={() => setHovered(null)}
        >
          {({ isActive }) => (
            <>
              <span>{t(link.key)}</span>
              {(hovered === link.to || (hovered == null && isActive)) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-primary"
                  transition={{ type: 'spring', stiffness: 520, damping: 36 }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function MobileQuickLinks() {
  const { t } = useI18n()
  return (
    <nav className="flex items-center gap-1 md:hidden">
      {NAV_LINKS.filter((link) => link.to !== '/').map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            [
              'inline-flex min-h-[34px] items-center rounded-sm border px-2 py-1 font-body text-[9px] font-semibold uppercase tracking-wide transition-colors min-[380px]:px-2.5 min-[380px]:text-[10px]',
              isActive
                ? 'border-primary/50 bg-primary/15 text-primary'
                : 'border-white/20 bg-white/[0.03] text-white/85 hover:text-white',
            ].join(' ')
          }
        >
          {t(link.key)}
        </NavLink>
      ))}
    </nav>
  )
}

export function Navbar() {
  const scrolled = useScrolled(10)
  const [hovered, setHovered] = useState(null)
  const { t } = useI18n()

  return (
    <header
      className={[
        'fixed left-0 right-0 top-0 z-50 w-full border-b border-transparent',
        scrolled ? 'bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-dark/95' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:h-20 sm:px-6">
        <div className="flex min-w-0 items-center">
          <NavLink
            to="/"
            className="group inline-flex min-h-[44px] min-w-0 items-center gap-1.5 py-1 sm:gap-2"
          >
            <span className="inline-block h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="font-display text-[22px] tracking-wide sm:text-[28px]">
                <span className="text-white">UNIT </span>
                <span className="text-primary">PRO</span>
              </span>
              <span className="mt-0.5 hidden max-w-[9.5rem] truncate font-body text-[8px] font-semibold uppercase tracking-[0.12em] text-white/70 min-[380px]:block sm:max-w-none sm:text-[9px] sm:tracking-[0.16em]">
                TRANSFORMATION CENTER
              </span>
            </span>
          </NavLink>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <DesktopNav hovered={hovered} setHovered={setHovered} />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <MobileQuickLinks />

          <NavLink
            to="/subscriptions"
            className="hidden h-11 items-center justify-center bg-primary px-5 font-body text-[11px] font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.03] hover:bg-accent md:inline-flex"
          >
            {t('nav.joinNow')}
          </NavLink>

        </div>
      </div>
    </header>
  )
}

