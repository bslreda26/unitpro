import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, Users, Tag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/employees', label: 'Employés', icon: Users, requiresSuperAdmin: true },
  {
    to: '/admin/subscriptions',
    label: 'Abonnements',
    icon: Tag,
    requiredPermission: 'manage_subscriptions',
  },
]

function SidebarLinks({ onNavigate }) {
  const { user, hasPermission } = useAuth()

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.requiresSuperAdmin && user?.role !== 'super_admin') return false
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) return false
    return true
  })

  return (
    <nav className="flex flex-col gap-1">
      {visibleItems.map(
        (item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-sm px-4 py-3 font-body text-sm font-medium uppercase tracking-wide transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              ].join(' ')
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ),
      )}
    </nav>
  )
}

export function AdminLayout() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark text-text-primary font-body">
      <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-white/80 hover:bg-white/5 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Basculer la navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-display text-xl tracking-wide">
            <span className="text-white">UNIT </span>
            <span className="text-primary">PRO ADMIN</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-text-muted sm:inline">{user?.email}</span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition-colors hover:border-primary/50 hover:text-primary"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-surface px-3 py-6 md:block">
          <SidebarLinks />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-dark/95 px-4 py-6 md:hidden">
            <SidebarLinks onNavigate={() => setMobileOpen(false)} />
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
