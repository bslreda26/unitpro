import { lazy, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar.jsx'
import { Footer } from './components/Footer.jsx'
import { AnimatedRoutes } from './components/AnimatedRoutes.jsx'
import { ScrollToTopButton } from './components/ScrollToTopButton.jsx'
import { LoadingScreen } from './components/LoadingScreen.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { scrollToTopInstant } from './utils/scrollToTopInstant.js'

const ClassesPage = lazy(() =>
  import('./pages/ClassesPage.jsx').then((m) => ({ default: m.ClassesPage })),
)
const SubscriptionsPage = lazy(() =>
  import('./pages/SubscriptionsPage.jsx').then((m) => ({
    default: m.SubscriptionsPage,
  })),
)
const LoginPage = lazy(() =>
  import('./pages/admin/LoginPage.jsx').then((m) => ({ default: m.LoginPage })),
)
const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout.jsx').then((m) => ({ default: m.AdminLayout })),
)
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage.jsx').then((m) => ({
    default: m.AdminDashboardPage,
  })),
)
const EmployeesPage = lazy(() =>
  import('./pages/admin/EmployeesPage.jsx').then((m) => ({ default: m.EmployeesPage })),
)
const AdminSubscriptionsPage = lazy(() =>
  import('./pages/admin/SubscriptionsPage.jsx').then((m) => ({ default: m.SubscriptionsPage })),
)

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const isAdminRoute = location.pathname === '/login' || location.pathname.startsWith('/admin')

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    // Ensure no stale inline overflow lock remains.
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (loading) return

    scrollToTopInstant()
    let innerRaf = 0
    const outerRaf = requestAnimationFrame(() => {
      scrollToTopInstant()
      innerRaf = requestAnimationFrame(scrollToTopInstant)
    })
    const t0 = setTimeout(scrollToTopInstant, 0)
    const t1 = setTimeout(scrollToTopInstant, 120)
    const t2 = setTimeout(scrollToTopInstant, 400)

    return () => {
      cancelAnimationFrame(outerRaf)
      if (innerRaf) cancelAnimationFrame(innerRaf)
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [loading])

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-dark text-text-primary font-body">
        <AnimatedRoutes
          HomePage={HomePage}
          ClassesPage={ClassesPage}
          SubscriptionsPage={SubscriptionsPage}
          LoginPage={LoginPage}
          AdminLayout={AdminLayout}
          AdminDashboardPage={AdminDashboardPage}
          EmployeesPage={EmployeesPage}
          AdminSubscriptionsPage={AdminSubscriptionsPage}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark text-text-primary font-body">
      <LoadingScreen show={loading} onDone={() => setLoading(false)} />

      {!loading && (
        <>
          <Navbar />
          <main className="pt-unit-header">
            <AnimatedRoutes
              HomePage={HomePage}
              ClassesPage={ClassesPage}
              SubscriptionsPage={SubscriptionsPage}
              LoginPage={LoginPage}
              AdminLayout={AdminLayout}
              AdminDashboardPage={AdminDashboardPage}
              EmployeesPage={EmployeesPage}
              AdminSubscriptionsPage={AdminSubscriptionsPage}
            />
          </main>
          <Footer />
          <ScrollToTopButton />
        </>
      )}
    </div>
  )
}
