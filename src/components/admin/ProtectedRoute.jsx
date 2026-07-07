import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export function ProtectedRoute({ requiredPermission, requiredRole, children }) {
  const { user, status, hasPermission } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark text-white/70">
        Loading…
      </div>
    )
  }

  if (status === 'anonymous' || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/admin" replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin" replace />
  }

  return children
}
