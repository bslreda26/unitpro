import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations.js'

const STORAGE_KEY = 'unitpro.lang'

function normalizeLang(lang) {
  return lang === 'fr' ? 'fr' : 'en'
}

function getInitialLang() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return normalizeLang(stored)
  } catch {
    // ignore
  }

  const nav = (typeof navigator !== 'undefined' && navigator.language) || ''
  if (nav.toLowerCase().startsWith('fr')) return 'fr'
  return 'en'
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  const dict = translations[lang] ?? translations.en

  const t = useCallback(
    (key) => {
      const parts = String(key).split('.')
      let cur = dict
      for (const p of parts) {
        cur = cur?.[p]
      }
      return typeof cur === 'string' ? cur : String(key)
    },
    [dict],
  )

  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => setLang(normalizeLang(next)),
      toggleLang: () => setLang((v) => (v === 'fr' ? 'en' : 'fr')),
      dict,
      t,
    }),
    [dict, lang, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

