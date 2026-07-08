import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import {
  createClass,
  createSlot,
  deleteClass,
  deleteSlot,
  listAdminClasses,
  listAdminSchedule,
  updateClass,
  updateSlot,
} from '../../api/groupClasses.api.js'

const CATEGORIES = [
  { value: 'Cardio', label: 'Cardio' },
  { value: 'Strength', label: 'Force' },
  { value: 'HIIT', label: 'HIIT' },
  { value: 'Conditioning', label: 'Conditioning' },
  { value: 'Recovery', label: 'Récupération' },
]

const IDEAL_FOR_OPTIONS = [
  { value: '', label: 'Aucun' },
  { value: 'idealFor', label: 'Idéal pour' },
  { value: 'perfectFor', label: 'Parfait pour' },
]

const DAY_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

const emptyClassForm = {
  category: 'Cardio',
  name: '',
  emoji: '',
  durationMinutes: 30,
  levels: '',
  description: '',
  benefits: '',
  idealForLabel: '',
  idealForItems: '',
  includes: '',
  note: '',
  time: '',
  imageUrl: '',
  showInCatalog: true,
  sortOrder: 0,
  isActive: true,
}

const emptySlotForm = {
  groupClassId: '',
  dayOfWeek: 0,
  startHour: 8,
  startMinute: 0,
}

function linesToArray(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function commaToArray(text) {
  return text
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

function classToForm(item) {
  return {
    category: item.category,
    name: item.name ?? '',
    emoji: item.emoji ?? '',
    durationMinutes: item.durationMinutes ?? '',
    levels: (item.levels ?? []).join(', '),
    description: item.description ?? '',
    benefits: (item.benefits ?? []).join('\n'),
    idealForLabel: item.idealFor?.label ?? '',
    idealForItems: (item.idealFor?.items ?? []).join('\n'),
    includes: (item.includes ?? []).join('\n'),
    note: item.note ?? '',
    time: item.time ?? '',
    imageUrl: item.imageUrl ?? '',
    showInCatalog: Boolean(item.showInCatalog),
    sortOrder: item.sortOrder ?? 0,
    isActive: item.isActive,
  }
}

function classFormToPayload(form) {
  return {
    category: form.category,
    name: form.name,
    emoji: form.emoji || null,
    durationMinutes: Number(form.durationMinutes) || 0,
    levels: commaToArray(form.levels),
    description: form.description || null,
    benefits: linesToArray(form.benefits),
    idealFor: form.idealForLabel
      ? { label: form.idealForLabel, items: linesToArray(form.idealForItems) }
      : { label: null, items: [] },
    includes: linesToArray(form.includes),
    note: form.note || null,
    time: form.time || null,
    imageUrl: form.imageUrl || null,
    showInCatalog: form.showInCatalog,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
  }
}

const inputClass =
  'border border-border bg-dark px-3 py-2.5 text-sm text-white outline-none focus:border-primary'
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-text-muted'

function ClassesTab() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyClassForm)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      setClasses(await listAdminClasses())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyClassForm)
    setError('')
    setIsFormOpen(true)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm(classToForm(item))
    setError('')
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => {
    setEditingId(null)
    setForm(emptyClassForm)
    setError('')
    setIsFormOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = classFormToPayload(form)
      if (editingId) {
        await updateClass(editingId, payload)
      } else {
        await createClass(payload)
      }
      closeForm()
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’enregistrer le cours')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (item) => {
    if (
      !window.confirm(
        `Supprimer « ${item.name} » ? Les créneaux du planning associés seront aussi supprimés.`,
      )
    )
      return
    await deleteClass(item.id)
    if (editingId === item.id) closeForm()
    await loadData()
  }

  const handleToggleActive = async (item) => {
    await updateClass(item.id, {
      ...classFormToPayload(classToForm(item)),
      isActive: !item.isActive,
    })
    await loadData()
  }

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: classes.filter((c) => c.category === cat.value),
  }))

  return (
    <div>
      <div className="border border-border bg-surface">
        <button
          type="button"
          onClick={() => (isFormOpen ? closeForm() : startCreate())}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="flex items-center gap-2 font-display text-xl tracking-wide text-white">
            {!isFormOpen && <Plus className="h-4 w-4 text-primary" />}
            {isFormOpen ? (editingId ? 'Modifier le cours' : 'Nouveau cours') : 'Nouveau cours'}
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
              <label className={labelClass}>Nom</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Emoji (facultatif)</label>
              <input
                type="text"
                value={form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Durée (minutes)</label>
              <input
                required
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Niveaux (séparés par des virgules)</label>
              <input
                type="text"
                placeholder="Débutant, Intermédiaire, Avancé"
                value={form.levels}
                onChange={(e) => setForm((f) => ({ ...f, levels: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Bénéfices (un par ligne)</label>
              <textarea
                rows={4}
                value={form.benefits}
                onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Type de recommandation</label>
              <select
                value={form.idealForLabel}
                onChange={(e) => setForm((f) => ({ ...f, idealForLabel: e.target.value }))}
                className={inputClass}
              >
                {IDEAL_FOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Éléments recommandés (un par ligne)</label>
              <textarea
                rows={3}
                value={form.idealForItems}
                onChange={(e) => setForm((f) => ({ ...f, idealForItems: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Contenu du cours (un par ligne, facultatif)</label>
              <textarea
                rows={3}
                value={form.includes}
                onChange={(e) => setForm((f) => ({ ...f, includes: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Note (facultatif, ex : astérisque calories)</label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Horaires affichés (texte libre)</label>
              <input
                type="text"
                placeholder="Lun / mer / ven — 12h30"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Image (URL, facultatif)</label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                className={inputClass}
              />
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
                  checked={form.showInCatalog}
                  onChange={(e) => setForm((f) => ({ ...f, showInCatalog: e.target.checked }))}
                />
                Afficher comme carte sur la page Cours
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
                {submitting ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Créer le cours'}
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
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Durée</th>
                    <th className="px-4 py-3">Page Cours</th>
                    <th className="px-4 py-3">Ordre</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-text-muted">
                        Chargement…
                      </td>
                    </tr>
                  )}
                  {!loading && cat.items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-text-muted">
                        Aucun cours dans cette catégorie pour l’instant.
                      </td>
                    </tr>
                  )}
                  {cat.items.map((item) => (
                    <tr key={item.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 text-white">
                        {item.emoji ? `${item.emoji} ` : ''}
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-white/70">{item.durationMinutes} min</td>
                      <td className="px-4 py-3 text-white/70">
                        {item.showInCatalog ? 'Oui' : 'Planning seul'}
                      </td>
                      <td className="px-4 py-3 text-white/70">{item.sortOrder}</td>
                      <td className="px-4 py-3">
                        <span className={item.isActive ? 'text-green-400' : 'text-white/40'}>
                          {item.isActive ? 'Actif' : 'Masqué'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-white/80 hover:border-primary/50 hover:text-primary"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-white/80 hover:border-primary/50 hover:text-primary"
                          >
                            {item.isActive ? 'Masquer' : 'Afficher'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
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

function ScheduleTab() {
  const [slots, setSlots] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptySlotForm)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const [slotsData, classesData] = await Promise.all([
        listAdminSchedule(),
        listAdminClasses(),
      ])
      setSlots(slotsData)
      setClasses(classesData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const classOptions = useMemo(
    () => [...classes].sort((a, b) => a.name.localeCompare(b.name)),
    [classes],
  )

  const startCreate = () => {
    setEditingId(null)
    setForm({ ...emptySlotForm, groupClassId: classOptions[0]?.id ?? '' })
    setError('')
    setIsFormOpen(true)
  }

  const startEdit = (slot) => {
    setEditingId(slot.id)
    setForm({
      groupClassId: slot.groupClassId,
      dayOfWeek: slot.dayOfWeek,
      startHour: slot.startHour,
      startMinute: slot.startMinute,
    })
    setError('')
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setEditingId(null)
    setForm(emptySlotForm)
    setError('')
    setIsFormOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        groupClassId: Number(form.groupClassId),
        dayOfWeek: Number(form.dayOfWeek),
        startHour: Number(form.startHour),
        startMinute: Number(form.startMinute),
      }
      if (editingId) {
        await updateSlot(editingId, payload)
      } else {
        await createSlot(payload)
      }
      closeForm()
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d’enregistrer le créneau')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (slot) => {
    if (!window.confirm('Supprimer ce créneau du planning ?')) return
    await deleteSlot(slot.id)
    if (editingId === slot.id) closeForm()
    await loadData()
  }

  const byDay = DAY_LABELS.map((label, idx) => ({
    label,
    dayOfWeek: idx,
    items: slots
      .filter((s) => s.dayOfWeek === idx)
      .sort((a, b) => a.startHour - b.startHour || a.startMinute - b.startMinute),
  }))

  return (
    <div>
      <div className="border border-border bg-surface">
        <button
          type="button"
          onClick={() => (isFormOpen ? closeForm() : startCreate())}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
          disabled={classOptions.length === 0}
        >
          <span className="flex items-center gap-2 font-display text-xl tracking-wide text-white">
            {!isFormOpen && <Plus className="h-4 w-4 text-primary" />}
            {isFormOpen
              ? editingId
                ? 'Modifier le créneau'
                : 'Nouveau créneau'
              : 'Ajouter un créneau'}
          </span>
          {isFormOpen ? (
            <ChevronUp className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/60" />
          )}
        </button>

        {classOptions.length === 0 && !loading && (
          <p className="px-6 pb-4 text-sm text-text-muted">
            Créez d’abord un cours dans l’onglet « Cours » pour pouvoir l’ajouter au planning.
          </p>
        )}

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 border-t border-border p-6 sm:grid-cols-2 md:grid-cols-4"
          >
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className={labelClass}>Cours</label>
              <select
                required
                value={form.groupClassId}
                onChange={(e) => setForm((f) => ({ ...f, groupClassId: e.target.value }))}
                className={inputClass}
              >
                {classOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.durationMinutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Jour</label>
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm((f) => ({ ...f, dayOfWeek: e.target.value }))}
                className={inputClass}
              >
                {DAY_LABELS.map((label, idx) => (
                  <option key={label} value={idx}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Heure</label>
              <div className="flex items-center gap-2">
                <input
                  required
                  type="number"
                  min="0"
                  max="23"
                  value={form.startHour}
                  onChange={(e) => setForm((f) => ({ ...f, startHour: e.target.value }))}
                  className={`${inputClass} w-full`}
                />
                <span className="text-white/60">:</span>
                <input
                  required
                  type="number"
                  min="0"
                  max="59"
                  step="5"
                  value={form.startMinute}
                  onChange={(e) => setForm((f) => ({ ...f, startMinute: e.target.value }))}
                  className={`${inputClass} w-full`}
                />
              </div>
            </div>

            {error && (
              <p className="md:col-span-4 text-sm text-primary" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3 md:col-span-4">
              <button
                type="submit"
                disabled={submitting}
                className="h-11 bg-primary px-6 font-body text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] hover:bg-accent disabled:opacity-60"
              >
                {submitting ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Ajouter'}
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
        {byDay.map((day) => (
          <div key={day.dayOfWeek}>
            <h2 className="font-display text-xl tracking-wide text-white">{day.label}</h2>
            <div className="mt-3 overflow-x-auto border border-border bg-surface">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                  <tr>
                    <th className="px-4 py-3">Heure</th>
                    <th className="px-4 py-3">Cours</th>
                    <th className="px-4 py-3">Durée</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-text-muted">
                        Chargement…
                      </td>
                    </tr>
                  )}
                  {!loading && day.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-text-muted">
                        Aucun créneau ce jour-là.
                      </td>
                    </tr>
                  )}
                  {day.items.map((slot) => (
                    <tr key={slot.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 text-white tabular-nums">
                        {String(slot.startHour).padStart(2, '0')}h
                        {String(slot.startMinute).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {slot.groupClass ? (
                          <>
                            {slot.groupClass.emoji ? `${slot.groupClass.emoji} ` : ''}
                            {slot.groupClass.name}
                          </>
                        ) : (
                          <span className="text-white/40">Cours supprimé</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {slot.groupClass?.durationMinutes ?? '—'} min
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(slot)}
                            className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-white/80 hover:border-primary/50 hover:text-primary"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(slot)}
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

export function ClassesPage() {
  const [tab, setTab] = useState('classes')

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-white">Cours & Planning</h1>
      <p className="mt-2 text-sm text-text-muted">
        Gérez le catalogue de cours collectifs et le planning hebdomadaire affichés sur la page
        publique.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab('classes')}
          className={[
            'px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-widest transition-colors',
            tab === 'classes'
              ? 'bg-primary text-white'
              : 'border border-border text-white/70 hover:border-primary/50 hover:text-white',
          ].join(' ')}
        >
          Cours
        </button>
        <button
          type="button"
          onClick={() => setTab('schedule')}
          className={[
            'px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-widest transition-colors',
            tab === 'schedule'
              ? 'bg-primary text-white'
              : 'border border-border text-white/70 hover:border-primary/50 hover:text-white',
          ].join(' ')}
        >
          Planning
        </button>
      </div>

      <div className="mt-6">{tab === 'classes' ? <ClassesTab /> : <ScheduleTab />}</div>
    </div>
  )
}
