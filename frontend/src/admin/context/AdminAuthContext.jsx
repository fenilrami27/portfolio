import React, { createContext, useContext, useState, useEffect } from 'react'
import { adminApi } from '../services/adminService'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fenil_admin_token'))
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fenil_admin_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function verifyAuth() {
      const savedToken = localStorage.getItem('fenil_admin_token')
      if (!savedToken) {
        setIsLoading(false)
        return
      }
      try {
        const data = await adminApi.getMe()
        if (data && data.user) {
          setUser(data.user)
          localStorage.setItem('fenil_admin_user', JSON.stringify(data.user))
        }
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          setToken(null)
          setUser(null)
          localStorage.removeItem('fenil_admin_token')
          localStorage.removeItem('fenil_admin_user')
        }
      } finally {
        setIsLoading(false)
      }
    }
    verifyAuth()
  }, [])

  const login = async (username, password) => {
    const data = await adminApi.login(username, password)
    if (data.token) {
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('fenil_admin_token', data.token)
      localStorage.setItem('fenil_admin_user', JSON.stringify(data.user))
    }
    return data
  }

  const logout = async () => {
    try {
      await adminApi.logout()
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('fenil_admin_token')
      localStorage.removeItem('fenil_admin_user')
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    const data = await adminApi.changePassword(oldPassword, newPassword)
    if (data.token) {
      setToken(data.token)
      localStorage.setItem('fenil_admin_token', data.token)
    }
    return data
  }

  const refreshUser = async () => {
    try {
      const data = await adminApi.getMe()
      if (data && data.user) {
        setUser(data.user)
        localStorage.setItem('fenil_admin_user', JSON.stringify(data.user))
      }
    } catch {
      // ignore
    }
  }

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
