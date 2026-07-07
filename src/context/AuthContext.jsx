import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { setAuthToken } from '../api/client.js'
import { login as loginRequest, fetchMe } from '../api/auth.api.js'

const STORAGE_KEY = 'unitpro_admin_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | authenticated | anonymous

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY)
    if (!storedToken) {
      setStatus('anonymous')
      return
    }

    setAuthToken(storedToken)
    fetchMe()
      .then((me) => {
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY)
        setAuthToken(null)
        setStatus('anonymous')
      })
  }, [])

  const login = async (email, password) => {
    const { token, user: loggedInUser } = await loginRequest(email, password)
    localStorage.setItem(STORAGE_KEY, token)
    setAuthToken(token)
    setUser(loggedInUser)
    setStatus('authenticated')
    return loggedInUser
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuthToken(null)
    setUser(null)
    setStatus('anonymous')
  }

  const hasPermission = (key) => {
    if (!user) return false
    if (user.role === 'super_admin') return true
    return user.permissions.includes(key)
  }

  const value = useMemo(
    () => ({ user, status, login, logout, hasPermission }),
    [user, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
