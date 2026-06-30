import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, loginUser, registerUser } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('skillcart_token')
    if (!token) {
      setLoading(false)
      return
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('skillcart_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const data = await loginUser(credentials)
    localStorage.setItem('skillcart_token', data.token)
    setUser({ userId: data.userId, name: data.name, email: data.email, role: data.role })
    return data
  }

  const register = async (payload) => {
    const data = await registerUser(payload)
    localStorage.setItem('skillcart_token', data.token)
    setUser({ userId: data.userId, name: data.name, email: data.email, role: data.role })
    return data
  }

  const logout = () => {
    localStorage.removeItem('skillcart_token')
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
