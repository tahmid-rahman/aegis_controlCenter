// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check auth status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('token')
      console.log('checkAuthStatus - Stored token:', storedToken)
      
      if (storedToken) {
        try {
          console.log('Making auth-status request...')
          
          // Create a custom request with explicit headers to ensure token is sent
          const response = await api.get('/auth/auth-status/', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          })
          
          console.log('Auth status response:', response.data)
          
          if (response.data.authenticated && response.data.user) {
            setUser(response.data.user)
            setToken(storedToken)
            console.log('User authenticated successfully')
          } else {
            console.log('Backend authentication failed')
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        } catch (err) {
          console.error('Auth status check failed:', err)
          console.log('Error response:', err.response?.data)
          
          // If it's an authentication error, clear the invalid token
          if (err.response?.status === 401) {
            console.log('Token is invalid, clearing...')
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        }
      } else {
        console.log('No token found in localStorage')
        setToken(null)
        setUser(null)
      }
      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    setError(null)
    try {
      console.log('Starting login process...')
      const res = await api.post('/auth/login/', { email, password })
      console.log('Login API response:', res.data)
      
      const { token: accessToken, user: userData } = res.data

      if (!userData || userData.user_type !== 'controller') {
        throw new Error("You're not allowed to login")
      }

      // Store token and user data
      localStorage.setItem('token', accessToken)
      setToken(accessToken)
      setUser(userData)
      
      console.log('Login successful!')
      
      navigate('/', { replace: true })
      
    } catch (err) {
      console.error('Login failed:', err)
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Login failed. Please try again.'
      setError(msg)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    navigate('/login')
  }

  // Debug effect to track auth state
  useEffect(() => {
    console.log('Auth state updated:', { 
      user, 
      hasToken: !!token,
      token: token,
      isAuthenticated: !!user && !!token,
      loading 
    })
  }, [user, token, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      error, 
      isAuthenticated: !!user && !!token,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}