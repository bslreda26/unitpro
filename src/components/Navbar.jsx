import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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

function Hamburger({ open }) {
  const common = 'absolute left-0 top-1/2 h-[2px] w-full bg-white'

  return (
    <div className="relative h-5 w-6">
      <motion.span
        className={common}
        style={{ translateY: -8 }}
        animate={open ? { rotate: 45, translateY: 0 } : { rotate: 0, translateY: -8 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
      <motion.span
        className={common}
        style={{ translateY: 0 }}
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className={common}
        style={{ translateY: 8 }}
        animate={open ? { rotate: -45, translateY: 0 } : { rotate: 0, translateY: 8 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
    </div>
  )
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

function MobilePanel({ open, onClose }) {
  const { t, lang, toggleLang } = useI18n()
  const panelVariants = {
    closed: { x: '100%' },
    open: { x: 0 },
  }

  const listVariants = {
    closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  }

  const itemVariants = {
    closed: { opacity: 0, x: 18 },
    open: { opacity: 1, x: 0 },
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label={t('a11y.closeMenu')}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-[100dvh] max-h-[100dvh] w-[min(100vw-3rem,22rem)] flex-col overflow-y-auto border-l border-border bg-dark/95 px-5 pb-safe-bottom pt-[max(1rem,env(safe-area-inset-top,0px))] backdrop-blur supports-[height:100dvh]:h-[100dvh] md:hidden"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl tracking-wide text-white">
                  UNIT
                </span>
                <span className="font-display text-2xl tracking-wide text-primary">
                  PRO
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLang}
                  className="inline-flex h-11 min-w-[44px] items-center justify-center border border-primary/35 bg-primary/10 px-3 font-body text-[10px] font-bold uppercase tracking-widest text-primary"
                  aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
                >
                  {lang === 'fr' ? 'EN' : 'FR'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-sm text-white/90 hover:text-white"
                  aria-label={t('a11y.closeMenu')}
                >
                  <Hamburger open />
                </button>
              </div>
            </div>

            <motion.div className="mt-8 flex-1" variants={listVariants} initial="closed" animate="open">
              <motion.ul className="space-y-1" variants={listVariants}>
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.to} variants={itemVariants}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          'block rounded-sm py-3.5 pl-1 pr-2 font-body text-base font-medium uppercase tracking-widest active:bg-white/5',
                          isActive ? 'text-primary' : 'text-white/90 hover:text-white',
                        ].join(' ')
                      }
                    >
                      {t(link.key)}
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div variants={itemVariants} className="mt-8 pb-2">
                <NavLink
                  to="/subscriptions"
                  onClick={onClose}
                  className="inline-flex min-h-12 w-full items-center justify-center bg-primary px-6 py-3.5 font-body text-xs font-semibold uppercase tracking-widest text-white transition active:scale-[0.98] hover:bg-accent"
                >
                  {t('nav.joinNow')}
                </NavLink>
              </motion.div>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export function Navbar() {
  const scrolled = useScrolled(10)
  const [hovered, setHovered] = useState(null)
  const [open, setOpen] = useState(false)
  const { t, lang, toggleLang } = useI18n()

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

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
    <>
      <motion.header
        className={[
          'fixed left-0 right-0 top-0 z-50 w-full border-b border-transparent pt-safe-top',
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
            <NavLink
              to="/subscriptions"
              className="hidden h-11 items-center justify-center bg-primary px-5 font-body text-[11px] font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.03] hover:bg-accent md:inline-flex"
            >
              {t('nav.joinNow')}
            </NavLink>

            <button
              type="button"
              onClick={toggleLang}
              className="hidden h-11 items-center justify-center border border-primary/35 bg-primary/10 px-3 font-body text-[10px] font-bold uppercase tracking-widest text-primary md:inline-flex"
              aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            <button
              type="button"
              aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-sm text-white active:bg-white/10 md:hidden"
            >
              <Hamburger open={open} />
            </button>
          </motion.div>
        </div>
      </motion.header>

      <MobilePanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}

