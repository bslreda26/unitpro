import { createContext, useCallback, useContext, useMemo } from 'react'
import { translations } from './translations.js'

// The site is French-only — no language toggle. `lang` is kept as a constant
// (rather than removed outright) so components that still branch on it for
// locale-aware formatting (e.g. date libraries) don't need to change.
const lang = 'fr'
const dict = translations.fr

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const t = useCallback((key) => {
    const parts = String(key).split('.')
    let cur = dict
    for (const p of parts) {
      cur = cur?.[p]
    }
    return typeof cur === 'string' ? cur : String(key)
  }, [])

  const value = useMemo(() => ({ lang, dict, t }), [t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
