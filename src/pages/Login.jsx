// src/pages/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, LogIn, AlertCircle, User, Lock } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('') // Clear error when user starts typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      if (formData.email === 'admin@aegis.com' && formData.password === 'password') {
        // Successful login
        localStorage.setItem('aegis-auth', 'true')
        navigate('/control-center')
      } else {
        setError('Invalid email or password. Please try again.')
      }
      setIsLoading(false)
    }, 1500)
  }

  const demoCredentials = [
    { role: 'Control Center Admin', email: 'admin@aegis.com', password: 'password' },
    { role: 'Emergency Responder', email: 'responder@aegis.com', password: 'password' },
    { role: 'View Only Access', email: 'viewer@aegis.com', password: 'password' }
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo and Header */}
          <div className="text-center lg:text-left">
            <Link to="/" className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-on-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-on-surface">Aegis</h1>
                <p className="text-sm text-on-surface-variant">Control Center</p>
              </div>
            </Link>
            <h2 className="mt-8 text-3xl font-bold text-on-surface">
              Sign in to dashboard
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Emergency response management system
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 bg-surface-variant rounded-lg p-4">
            <h3 className="text-sm font-medium text-on-surface mb-3">Demo Credentials:</h3>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="text-xs">
                  <span className="font-medium text-on-surface">{cred.role}:</span>
                  <span className="text-on-surface-variant ml-2">
                    {cred.email} / {cred.password}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-error" />
                <span className="text-error text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field w-full pl-10 pr-4 py-3"
                    placeholder="admin@aegis.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="input-field w-full pl-10 pr-12 py-3"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-on-surface-variant hover:text-on-surface" />
                    ) : (
                      <Eye className="h-5 w-5 text-on-surface-variant hover:text-on-surface" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-outline rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-on-surface">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center items-center space-x-2 py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>Sign in to Control Center</span>
                  </>
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="text-center">
              <p className="text-xs text-on-surface-variant">
                This is a secure system. All activities are logged and monitored.
              </p>
            </div>
          </form>

          {/* Back to Welcome */}
          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              ← Back to Aegis homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-md">
            {/* Emergency Stats */}
            <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-on-surface mb-6 text-center">
                Live System Status
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-on-surface-variant">Active Emergencies</p>
                    <p className="text-2xl font-bold text-on-surface">12</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-on-surface-variant">Available Responders</p>
                    <p className="text-2xl font-bold text-on-surface">8</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-green-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-variant rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-on-surface-variant">Avg Response Time</p>
                    <p className="text-2xl font-bold text-on-surface">4.2min</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="mt-8 space-y-4">
                <h4 className="font-semibold text-on-surface mb-4">Control Center Features:</h4>
                {[
                  'Real-time emergency monitoring',
                  'Smart responder assignment',
                  'Live GPS tracking',
                  'Incident analytics & reporting',
                  'Multi-agency coordination'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-on-surface-variant">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-surface/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm text-on-surface-variant">Secure & Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login