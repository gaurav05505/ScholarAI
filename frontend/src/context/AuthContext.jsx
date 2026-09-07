import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { loginUser, registerUser } from '../services/auth.service.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  // Configure Axios defaults and interceptors
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }

    // Set up interceptor to dynamically catch token changes or token presence
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Set up response interceptor to handle token expiry / 401 unauthorized
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid, log out user
          logout()
        }
        return Promise.reject(error)
      }
    )

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [token])

  // Verify auth on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        console.error('Error reading auth state from localStorage:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await loginUser({ email, password })
      if (response && response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        setToken(response.token)
        setUser(response.user)
        return { success: true, user: response.user }
      }
      return { success: false, message: 'Invalid response from server' }
    } catch (err) {
      console.error('Login error:', err)
      const errorMsg = err.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, message: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const response = await registerUser({ name, email, password })
      if (response && response.token) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        setToken(response.token)
        setUser(response.user)
        return { success: true, user: response.user }
      }
      return { success: true, message: 'Registration successful! Please log in.' }
    } catch (err) {
      console.error('Registration error:', err)
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.'
      return { success: false, message: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updatedData }
      localStorage.setItem('user', JSON.stringify(next))
      return next
    })
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
