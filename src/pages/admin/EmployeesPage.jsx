import { useEffect, useState } from 'react'
import {
  createEmployee,
  deleteEmployee,
  listEmployees,
  listPermissions,
  updateEmployee,
} from '../../api/users.api.js'

const emptyForm = { name: '', email: '', password: '', permissionKeys: [] }

export function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [permissions, setPermissions] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    try {
      const [employeesData, permissionsData] = await Promise.all([
        listEmployees(),
        listPermissions(),
      ])
      setEmployees(employeesData)
      setPermissions(permissionsData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const togglePermission = (key) => {
    setForm((f) => ({
      ...f,
      permissionKeys: f.permissionKeys.includes(key)
        ? f.permissionKeys.filter((k) => k !== key)
        : [...f.permissionKeys, key],
    }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createEmployee(form)
      setForm(emptyForm)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de créer l’employé')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (employee) => {
    await updateEmployee(employee.id, { isActive: !employee.isActive })
    await loadData()
  }

  const handleDelete = async (employee) => {
    if (!window.confirm(`Supprimer ${employee.name} ? Cette action est irréversible.`)) return
    await deleteEmployee(employee.id)
    await loadData()
  }

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-white">Employés</h1>
      <p className="mt-2 text-sm text-text-muted">
        Créez des comptes employés et attribuez-leur des privilèges spécifiques.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid grid-cols-1 gap-4 border border-border bg-surface p-6 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Nom
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="border border-border bg-dark px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="border border-border bg-dark px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Mot de passe temporaire
          </label>
          <input
            required
            type="text"
            minLength={8}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="border border-border bg-dark px-3 py-2.5 text-sm text-white outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Privilèges
          </span>
          <div className="flex flex-wrap gap-3">
            {permissions.map((perm) => (
              <label
                key={perm.key}
                className="flex items-center gap-2 border border-border px-3 py-2 text-xs text-white/80"
              >
                <input
                  type="checkbox"
                  checked={form.permissionKeys.includes(perm.key)}
                  onChange={() => togglePermission(perm.key)}
                />
                {perm.label}
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p className="sm:col-span-2 text-sm text-primary" role="alert">
            {error}
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="h-11 bg-primary px-6 font-body text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] hover:bg-accent disabled:opacity-60"
          >
            {submitting ? 'Création…' : 'Créer un employé'}
          </button>
        </div>
      </form>

      <div className="mt-8 overflow-x-auto border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Privilèges</th>
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
            {!loading && employees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-text-muted">
                  Aucun compte administrateur pour l’instant.
                </td>
              </tr>
            )}
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-white">{employee.name}</td>
                <td className="px-4 py-3 text-white/70">{employee.email}</td>
                <td className="px-4 py-3 text-white/70">
                  {employee.role === 'super_admin' ? 'Toutes' : employee.permissions.join(', ') || '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      employee.isActive ? 'text-green-400' : 'text-white/40'
                    }
                  >
                    {employee.isActive ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {employee.role !== 'super_admin' && (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(employee)}
                        className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-white/80 hover:border-primary/50 hover:text-primary"
                      >
                        {employee.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(employee)}
                        className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-white/80 hover:border-primary/50 hover:text-primary"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
