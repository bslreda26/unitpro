import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'
import { I18nProvider } from './i18n/I18nProvider.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParallaxProvider>
      <I18nProvider>
        <HashRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </HashRouter>
      </I18nProvider>
    </ParallaxProvider>
  </StrictMode>,
)
