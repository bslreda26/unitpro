import { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './PageTransition.jsx'
import { ProtectedRoute } from './admin/ProtectedRoute.jsx'

export function AnimatedRoutes({
  HomePage,
  ClassesPage,
  SubscriptionsPage,
  LoginPage,
  AdminLayout,
  AdminDashboardPage,
  EmployeesPage,
  AdminSubscriptionsPage,
  ContactInfoPage,
  AdminClassesPage,
}) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-6xl px-6 py-20 text-white/80">
            Loading…
          </div>
        }
      >
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/classes"
            element={
              <PageTransition>
                <ClassesPage />
              </PageTransition>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <PageTransition>
                <SubscriptionsPage />
              </PageTransition>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route
              path="employees"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="subscriptions"
              element={
                <ProtectedRoute requiredPermission="manage_subscriptions">
                  <AdminSubscriptionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="contact-info"
              element={
                <ProtectedRoute requiredPermission="manage_settings">
                  <ContactInfoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="classes"
              element={
                <ProtectedRoute requiredPermission="manage_courses">
                  <AdminClassesPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}
