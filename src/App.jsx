import { lazy, useState } from 'react'
import { Navbar } from './components/Navbar.jsx'
import { Footer } from './components/Footer.jsx'
import { AnimatedRoutes } from './components/AnimatedRoutes.jsx'
import { ScrollToTopButton } from './components/ScrollToTopButton.jsx'
import { LoadingScreen } from './components/LoadingScreen.jsx'

const HomePage = lazy(() =>
  import('./pages/HomePage.jsx').then((m) => ({ default: m.HomePage })),
)
const ClassesPage = lazy(() =>
  import('./pages/ClassesPage.jsx').then((m) => ({ default: m.ClassesPage })),
)
const SubscriptionsPage = lazy(() =>
  import('./pages/SubscriptionsPage.jsx').then((m) => ({
    default: m.SubscriptionsPage,
  })),
)

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="min-h-screen bg-dark text-text-primary font-body">
      <LoadingScreen show={loading} onDone={() => setLoading(false)} />

      {!loading && (
        <>
          <Navbar />
          <main className="pt-20">
            <AnimatedRoutes
              HomePage={HomePage}
              ClassesPage={ClassesPage}
              SubscriptionsPage={SubscriptionsPage}
            />
          </main>
          <Footer />
          <ScrollToTopButton />
        </>
      )}
    </div>
  )
}
