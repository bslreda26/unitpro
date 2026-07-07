import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'
import { I18nProvider } from './i18n/I18nProvider.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ContactProvider } from './context/ContactContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParallaxProvider>
      <I18nProvider>
        <ContactProvider>
          <HashRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </HashRouter>
        </ContactProvider>
      </I18nProvider>
    </ParallaxProvider>
  </StrictMode>,
)
