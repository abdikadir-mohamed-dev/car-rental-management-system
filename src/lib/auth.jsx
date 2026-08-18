import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Session handling: on load (and whenever asked), verify the stored token
  // against the backend and hydrate the current user, or clear a stale token.
  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { user } = await api('/api/auth/me')
      setUser(user)
    } catch {
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email, password) => {
    const { token, user } = await api('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setToken(token)
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (payload) => {
    const { token, user } = await api('/api/auth/register', {
      method: 'POST',
      body: payload,
    })
    setToken(token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // Forgot / reset password flow (shared auth system: customer, staff, driver, admin).
  const requestPasswordReset = useCallback(async (email) => {
    return api('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    })
  }, [])

  const resetPassword = useCallback(async (token, newPassword) => {
    return api('/api/auth/reset-password', {
      method: 'POST',
      body: { token, new_password: newPassword },
    })
  }, [])

  // Change password while logged in (also used for a staff/driver's forced
  // first-login temporary-password change).
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const { user } = await api('/api/auth/profile', {
      method: 'PUT',
      body: { current_password: currentPassword, new_password: newPassword },
    })
    setUser(user)
    return user
  }, [])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refresh,
    requestPasswordReset,
    resetPassword,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/** Where a logged-in user should land after auth, based on their role. */
export function homeRouteFor(user) {
  if (!user) return '/catalog'
  if (user.role === 'admin') return '/admin'
  if (user.role === 'staff') return '/staff'
  if (user.role === 'driver') return '/driver'
  return '/catalog'
}
