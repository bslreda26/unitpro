import { useEffect, useState } from 'react'
import { fetchAdminContactInfo, updateContactInfo } from '../../api/contactInfo.api.js'

const emptyForm = {
  email: '',
  phone: '',
  whatsappNumber: '',
  hours: '',
  locationLabel: '',
  mapQuery: '',
}

function infoToForm(info) {
  return {
    email: info.email ?? '',
    phone: info.phone ?? '',
    whatsappNumber: info.whatsappNumber ?? '',
    hours: info.hours ?? '',
    locationLabel: info.locationLabel ?? '',
    mapQuery: info.mapQuery ?? '',
  }
}

function formToPayload(form) {
  return {
    email: form.email,
    phone: form.phone,
    whatsappNumber: form.whatsappNumber,
    hours: form.hours,
    locationLabel: form.locationLabel,
    mapQuery: form.mapQuery,
  }
}

const inputClass =
  'border border-border bg-dark px-3 py-2.5 text-sm text-white outline-none focus:border-primary'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-text-muted'

export function ContactInfoPage() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    fetchAdminContactInfo()
      .then((info) => setForm(infoToForm(info)))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const info = await updateContactInfo(formToPayload(form))
      setForm(infoToForm(info))
      setSavedAt(Date.now())
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’enregistrer les informations')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-text-muted">Chargement…</p>
  }

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-white">Informations de contact</h1>
      <p className="mt-2 text-sm text-text-muted">
        Modifiez l’email, le téléphone, le numéro WhatsApp, les horaires et la localisation
        affichés sur le site public.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-4 border border-border bg-surface p-6 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Téléphone (affiché, lien tel:)</label>
          <input
            required
            type="text"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Numéro WhatsApp (format international, sans +)</label>
          <input
            required
            type="text"
            placeholder="2250700000000"
            value={form.whatsappNumber}
            onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Requête carte (Google Maps)</label>
          <input
            type="text"
            placeholder="Cocody, Abidjan"
            value={form.mapQuery}
            onChange={(e) => setForm((f) => ({ ...f, mapQuery: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass}>Horaires</label>
          <input
            type="text"
            value={form.hours}
            onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass}>Localisation affichée</label>
          <input
            type="text"
            value={form.locationLabel}
            onChange={(e) => setForm((f) => ({ ...f, locationLabel: e.target.value }))}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="sm:col-span-2 text-sm text-primary" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="h-11 bg-primary px-6 font-body text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] hover:bg-accent disabled:opacity-60"
          >
            {submitting ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {savedAt && !submitting && (
            <span className="text-xs text-green-400">Enregistré.</span>
          )}
        </div>
      </form>
    </div>
  )
}
