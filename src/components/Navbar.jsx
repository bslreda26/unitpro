import { useEffect, useMemo, useState } from 'react'
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
              'inline-flex min-h-[36px] items-center rounded-sm border px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-wide transition-colors',
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
  const { t, lang, toggleLang } = useI18n()

  const containerVariants = useMemo(
    () => ({
      hidden: { y: -18, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.12 },
      },
    }),
    [],
  )

  const childVariants = useMemo(
    () => ({
      hidden: { y: -10, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 420, damping: 28 } },
    }),
    [],
  )

  return (
    <motion.header
      className={[
        'fixed left-0 right-0 top-0 z-50 w-full border-b border-transparent',
        scrolled ? 'bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-dark/95' : 'bg-transparent',
      ].join(' ')}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center px-4 sm:px-6">
        <motion.div variants={childVariants} className="flex min-w-0 items-center">
          <NavLink
            to="/"
            className="group inline-flex min-h-[44px] min-w-[44px] items-center gap-2 py-1"
          >
            <span className="inline-block h-2 w-2 bg-primary" aria-hidden="true" />
            <span className="font-display text-[28px] leading-none tracking-wide text-white">
              UNIT
            </span>
            <span className="font-display text-[28px] leading-none tracking-wide text-primary">
              PRO
            </span>
          </NavLink>
        </motion.div>

        <motion.div variants={childVariants} className="flex flex-1 justify-center">
          <DesktopNav hovered={hovered} setHovered={setHovered} />
        </motion.div>

        <motion.div variants={childVariants} className="flex items-center gap-3">
          <MobileQuickLinks />

          <NavLink
            to="/subscriptions"
            className="hidden h-11 items-center justify-center bg-primary px-5 font-body text-[11px] font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.03] hover:bg-accent md:inline-flex"
          >
            {t('nav.joinNow')}
          </NavLink>

          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center border border-primary/35 bg-primary/10 px-3 font-body text-[10px] font-bold uppercase tracking-widest text-primary"
            aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
        </motion.div>
      </div>
    </motion.header>
  )
}

