import { useAuth } from '../../context/AuthContext.jsx'

export function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="font-display text-3xl tracking-wide text-white">
        Bienvenue, {user?.name}
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Connecté en tant que <span className="text-white">{user?.role === 'super_admin' ? 'Super Administrateur' : 'Employé'}</span>.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-border bg-surface p-6">
          <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-text-muted">
            Cours & Classes
          </h2>
          <p className="mt-2 text-sm text-white/70">Bientôt disponible — gérez le catalogue de cours ici.</p>
        </div>
        <div className="border border-border bg-surface p-6">
          <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-text-muted">
            Abonnements & Tarifs
          </h2>
          <p className="mt-2 text-sm text-white/70">Modifiez les forfaits et les tarifs ici.</p>
        </div>
        <div className="border border-border bg-surface p-6">
          <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-text-muted">
            Clients
          </h2>
          <p className="mt-2 text-sm text-white/70">Bientôt disponible — gérez les clients et leurs abonnements ici.</p>
        </div>
      </div>
    </div>
  )
}
