import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import {
  createPlan,
  deletePlan,
  listAdminPlans,
  updatePlan,
} from '../../api/subscriptionPlans.api.js'

const CATEGORIES = [
  { value: 'day_pass', label: 'Pass journée' },
  { value: 'membership', label: 'Abonnement' },
  { value: 'group_class', label: 'Pack cours collectifs' },
  { value: 'personal_training', label: 'Pack coaching personnel' },
  { value: 'special_offer', label: 'Offre spéciale' },
]

const emptyForm = {
  category: 'membership',
  planKey: '',
  nameEn: '',
  nameFr: '',
  subtitleEn: '',
  subtitleFr: '',
  bestForEn: '',
  bestForFr: '',
  price: '',
  suffixEn: '',
  suffixFr: '',
  featuresEn: '',
  featuresFr: '',
  ctaLabelEn: '',
  ctaLabelFr: '',
  ctaVariant: 'outline',
  featured: false,
  sortOrder: 0,
  isActive: true,
}

function linesToArray(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function planToForm(plan) {
  return {
    category: plan.category,
    planKey: plan.planKey ?? '',
    nameEn: plan.name?.en ?? '',
    nameFr: plan.name?.fr ?? '',
    subtitleEn: plan.subtitle?.en ?? '',
    subtitleFr: plan.subtitle?.fr ?? '',
    bestForEn: plan.bestFor?.en ?? '',
    bestForFr: plan.bestFor?.fr ?? '',
    price: plan.price ?? '',
    suffixEn: plan.suffix?.en ?? '',
    suffixFr: plan.suffix?.fr ?? '',
    featuresEn: (plan.features?.en ?? []).join('\n'),
    featuresFr: (plan.features?.fr ?? []).join('\n'),
    ctaLabelEn: plan.cta?.label?.en ?? '',
    ctaLabelFr: plan.cta?.label?.fr ?? '',
    ctaVariant: plan.cta?.variant ?? 'outline',
    featured: Boolean(plan.featured),
    sortOrder: plan.sortOrder ?? 0,
    isActive: plan.isActive,
  }
}

function formToPayload(form) {
  return {
    category: form.category,
    planKey: form.planKey || null,
    name: { en: form.nameEn, fr: form.nameFr },
    subtitle: { en: form.subtitleEn || null, fr: form.subtitleFr || null },
    bestFor: { en: form.bestForEn || null, fr: form.bestForFr || null },
    price: form.price === '' ? null : Number(form.price),
    suffix: { en: form.suffixEn || null, fr: form.suffixFr || null },
    features: { en: linesToArray(form.featuresEn), fr: linesToArray(form.featuresFr) },
    cta: {
      label: { en: form.ctaLabelEn || null, fr: form.ctaLabelFr || null },
      variant: form.ctaVariant,
    },
    featured: form.featured,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
  }
}

const inputClass =
  'border border-border bg-dark px-3 py-2.5 text-sm text-white outline-none focus:border-primary'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-text-muted'

export function SubscriptionsPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      setPlans(await listAdminPlans())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setIsFormOpen(true)
  }

  const startEdit = (plan) => {
    setEditingId(plan.id)
    setForm(planToForm(plan))
    setError('')
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setIsFormOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = formToPayload(form)
      if (editingId) {
        await updatePlan(editingId, payload)
      } else {
        await createPlan(payload)
      }
      closeForm()
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’enregistrer le forfait')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (plan) => {
    if (!window.confirm(`Supprimer « ${plan.name.fr} » ? Cette action est irréversible.`)) return
    await deletePlan(plan.id)
    if (editingId === plan.id) closeForm()
    await loadData()
  }

  const handleToggleActive = async (plan) => {
    await updatePlan(plan.id, { ...formToPayload(planToForm(plan)), isActive: !plan.isActive })
    await loadData()
  }

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: plans.filter((p) => p.category === cat.value),
  }))

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-white">Abonnements & Tarifs</h1>
      <p className="mt-2 text-sm text-text-muted">
        Modifiez les forfaits, packs et offres affichés sur la page tarifs publique.
      </p>

      <div className="mt-6 border border-border bg-surface">
        <button
          type="button"
          onClick={() => (isFormOpen ? closeForm() : startCreate())}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="flex items-center gap-2 font-display text-xl tracking-wide text-white">
            {!isFormOpen && <Plus className="h-4 w-4 text-primary" />}
            {isFormOpen ? (editingId ? 'Modifier le forfait' : 'Nouveau forfait') : 'Nouveau forfait'}
          </span>
          {isFormOpen ? (
            <ChevronUp className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/60" />
          )}
        </button>

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 border-t border-border p-6 sm:grid-cols-2"
          >
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Clé du forfait (identifiant, facultatif)</label>
          <input
            type="text"
            value={form.planKey}
            onChange={(e) => setForm((f) => ({ ...f, planKey: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nom (EN)</label>
          <input
            required
            type="text"
            value={form.nameEn}
            onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nom (FR)</label>
          <input
            required
            type="text"
            value={form.nameFr}
            onChange={(e) => setForm((f) => ({ ...f, nameFr: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Sous-titre / description (EN)</label>
          <input
            type="text"
            value={form.subtitleEn}
            onChange={(e) => setForm((f) => ({ ...f, subtitleEn: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Sous-titre / description (FR)</label>
          <input
            type="text"
            value={form.subtitleFr}
            onChange={(e) => setForm((f) => ({ ...f, subtitleFr: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Idéal pour (EN)</label>
          <input
            type="text"
            value={form.bestForEn}
            onChange={(e) => setForm((f) => ({ ...f, bestForEn: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Idéal pour (FR)</label>
          <input
            type="text"
            value={form.bestForFr}
            onChange={(e) => setForm((f) => ({ ...f, bestForFr: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Prix (FCFA, laisser vide si aucun)</label>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Suffixe (EN)</label>
            <input
              type="text"
              placeholder="/ month"
              value={form.suffixEn}
              onChange={(e) => setForm((f) => ({ ...f, suffixEn: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Suffixe (FR)</label>
            <input
              type="text"
              placeholder="/ mois"
              value={form.suffixFr}
              onChange={(e) => setForm((f) => ({ ...f, suffixFr: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Fonctionnalités (EN, une par ligne)</label>
          <textarea
            rows={4}
            value={form.featuresEn}
            onChange={(e) => setForm((f) => ({ ...f, featuresEn: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Fonctionnalités (FR, une par ligne)</label>
          <textarea
            rows={4}
            value={form.featuresFr}
            onChange={(e) => setForm((f) => ({ ...f, featuresFr: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Libellé du bouton (EN)</label>
          <input
            type="text"
            value={form.ctaLabelEn}
            onChange={(e) => setForm((f) => ({ ...f, ctaLabelEn: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Libellé du bouton (FR)</label>
          <input
            type="text"
            value={form.ctaLabelFr}
            onChange={(e) => setForm((f) => ({ ...f, ctaLabelFr: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Style du bouton</label>
          <select
            value={form.ctaVariant}
            onChange={(e) => setForm((f) => ({ ...f, ctaVariant: e.target.value }))}
            className={inputClass}
          >
            <option value="outline">Contour</option>
            <option value="solid">Plein</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Ordre d’affichage</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-xs text-white/80">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Mis en avant (carte surlignée, abonnements uniquement)
          </label>
          <label className="flex items-center gap-2 text-xs text-white/80">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Actif (visible sur le site public)
          </label>
        </div>

        {error && (
          <p className="sm:col-span-2 text-sm text-primary" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="h-11 bg-primary px-6 font-body text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] hover:bg-accent disabled:opacity-60"
          >
            {submitting ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Créer le forfait'}
          </button>
          <button
            type="button"
            onClick={closeForm}
            className="h-11 border border-border px-6 font-body text-sm font-semibold uppercase tracking-widest text-white/80 hover:border-primary/50 hover:text-primary"
          >
            Annuler
          </button>
        </div>
          </form>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {grouped.map((cat) => (
          <div key={cat.value}>
            <h2 className="font-display text-xl tracking-wide text-white">{cat.label}</h2>
            <div className="mt-3 overflow-x-auto border border-border bg-surface">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Prix</th>
                    <th className="px-4 py-3">Ordre</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-text-muted">
                        Chargement…
                      </td>
                    </tr>
                  )}
                  {!loading && cat.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-text-muted">
                        Aucun forfait dans cette catégorie pour l’instant.
                      </td>
                    </tr>
                  )}
                  {cat.items.map((plan) => (
                    <tr key={plan.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 text-white">
                        {plan.name.fr}
                        {plan.featured ? (
                          <span className="ml-2 text-[10px] uppercase tracking-wide text-primary">
                            Mis en avant
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {plan.price != null ? `${plan.price} FCFA` : '—'}
                      </td>
                      <td className="px-4 py-3 text-white/70">{plan.sortOrder}</td>
                      <td className="px-4 py-3">
                        <span className={plan.isActive ? 'text-green-400' : 'text-white/40'}>
                          {plan.isActive ? 'Actif' : 'Masqué'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(plan)}
                            className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-white/80 hover:border-primary/50 hover:text-primary"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(plan)}
                            className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-white/80 hover:border-primary/50 hover:text-primary"
                          >
                            {plan.isActive ? 'Masquer' : 'Afficher'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(plan)}
                            className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-white/80 hover:border-primary/50 hover:text-primary"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
