import { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './PageTransition.jsx'

export function AnimatedRoutes({ HomePage, ClassesPage, SubscriptionsPage }) {
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

