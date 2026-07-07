import { createContext, useContext, useEffect, useState } from 'react'
import { fetchPublicContactInfo } from '../api/contactInfo.api.js'

const FALLBACK_CONTACT = {
  email: '',
  phone: '',
  whatsappNumber: '',
  hours: '',
  locationLabel: '',
  mapQuery: '',
}

const ContactContext = createContext(null)

export function ContactProvider({ children }) {
  const [contact, setContact] = useState(FALLBACK_CONTACT)

  useEffect(() => {
    let cancelled = false
    fetchPublicContactInfo()
      .then((data) => {
        if (!cancelled) setContact(data)
      })
      .catch(() => {
        if (!cancelled) setContact(FALLBACK_CONTACT)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>
}

export function useContact() {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error('useContact must be used within a ContactProvider')
  return ctx
}
