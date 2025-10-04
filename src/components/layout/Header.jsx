// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react'
import { Bell, Search, User, LogOut, Settings, Moon, Sun, Monitor, Router } from 'lucide-react'
import { useEmergencies } from '../../contexts/EmergencyContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const { emergencies } = useEmergencies()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate();
  const { logout } = useAuth()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const activeEmergencies = emergencies.filter(e => 
    e.status === 'active' || e.status === 'assigned'
  ).length

  const recentNotifications = [
    {
      id: 1,
      type: 'emergency',
      title: 'New Emergency Alert',
      message: 'Emergency #EMG-2024-0012 - Harassment reported',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'responder',
      title: 'Responder Assigned',
      message: 'Officer Khan assigned to EMG-2024-0012',
      time: '5 minutes ago',
      read: true
    }
  ]

  const unreadCount = recentNotifications.filter(n => !n.read).length

  return (
    <header className="bg-surface border-b border-outline px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
            <input
              type="text"
              placeholder="Search emergencies, responders..."
              className="input-field w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Time & Date */}
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium text-on-surface">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
              })}
            </div>
            <div className="text-xs text-on-surface-variant">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Emergency Alert Badge */}
          {activeEmergencies > 0 && (
            <div className="relative">
              <div className="w-3 h-3 bg-panic rounded-full animate-ping absolute -top-1 -right-1"></div>
              <div className="px-3 py-1 bg-panic/20 text-panic rounded-full text-sm font-medium">
                {activeEmergencies} Active
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
            >
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-outline z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      document.documentElement.classList.remove('dark')
                      localStorage.setItem('shield-theme', 'light')
                      setShowThemeMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-variant rounded-md transition-colors"
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      document.documentElement.classList.add('dark')
                      localStorage.setItem('shield-theme', 'dark')
                      setShowThemeMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-variant rounded-md transition-colors"
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                      if (systemPrefersDark) {
                        document.documentElement.classList.add('dark')
                      } else {
                        document.documentElement.classList.remove('dark')
                      }
                      localStorage.removeItem('shield-theme')
                      setShowThemeMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-variant rounded-md transition-colors"
                  >
                    <Monitor className="h-4 w-4" />
                    <span>System Default</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-panic text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface rounded-lg shadow-lg border border-outline z-50">
                <div className="p-4 border-b border-outline">
                  <h3 className="font-semibold text-on-surface">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recentNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-outline hover:bg-surface-variant cursor-pointer ${
                        !notification.read ? 'bg-primary/10' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-on-surface text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-on-surface-variant text-sm mt-1">
                            {notification.message}
                          </p>
                          <span className="text-xs text-on-surface-variant mt-2 block">
                            {notification.time}
                          </span>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-outline">
                  <button className="w-full text-center text-sm text-primary hover:text-primary/80 py-2">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-on-primary" />
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-sm font-medium">Control Center Admin</div>
                <div className="text-xs text-on-surface-variant">Administrator</div>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-outline z-50">
                <div className="p-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-variant rounded-md transition-colors"
                  onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-variant rounded-md transition-colors"
                  onClick={() => navigate("/profile")}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <hr className="my-2 border-outline" />
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors"
                  onClick={() => {handleLogout()}}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showUserMenu || showThemeMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
            setShowThemeMenu(false)
          }}
        ></div>
      )}
    </header>
  )
}

export default Header