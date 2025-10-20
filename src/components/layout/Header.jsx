// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Bell, Search, User, LogOut, Settings, Moon, Sun, Monitor, Router, AlertTriangle, CheckCircle, MapPin, Camera, UserCheck } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [activeEmergencyCount, setActiveEmergencyCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate();
  const { logout } = useAuth()
  const notificationIntervalRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/aegis/notifications/')
      if (response.data.success) {
        setNotifications(response.data.data)
        setUnreadCount(response.data.unread_count)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.post(`/aegis/notifications/${notificationId}/read/`)
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.is_read)
      await Promise.all(
        unreadNotifications.map(notif => 
          api.post(`/aegis/notifications/${notif.id}/read/`)
        )
      )
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Fetch active emergencies count
  const fetchActiveEmergencies = async () => {
    try {
      const response = await api.get('/aegis/emergency/active/')
      if (response.data.success) {
        setActiveEmergencyCount(response.data.count)
      }
    } catch (error) {
      console.error('Error fetching active emergencies:', error)
      setActiveEmergencyCount(0)
    }
  }

  // Set up polling for notifications and active emergencies
  useEffect(() => {
    // Initial fetch
    fetchNotifications()
    fetchActiveEmergencies()

    // Set up polling every 30 seconds for notifications, 10 seconds for emergencies
    const notificationInterval = setInterval(fetchNotifications, 30000)
    const emergencyInterval = setInterval(fetchActiveEmergencies, 10000)

    return () => {
      clearInterval(notificationInterval)
      clearInterval(emergencyInterval)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconProps = { className: "h-4 w-4" }
    
    switch (type) {
      case 'alert_activated':
        return <AlertTriangle {...iconProps} className="text-panic" />
      case 'responder_assigned':
        return <UserCheck {...iconProps} className="text-success" />
      case 'status_update':
        return <CheckCircle {...iconProps} className="text-info" />
      case 'location_update':
        return <MapPin {...iconProps} className="text-warning" />
      case 'media_uploaded':
        return <Camera {...iconProps} className="text-primary" />
      case 'alert_resolved':
        return <CheckCircle {...iconProps} className="text-success" />
      default:
        return <Bell {...iconProps} className="text-on-surface-variant" />
    }
  }

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Get notification type display name
  const getNotificationTypeName = (type) => {
    const typeMap = {
      'alert_activated': 'Alert Activated',
      'responder_assigned': 'Responder Assigned',
      'status_update': 'Status Update',
      'location_update': 'Location Update',
      'media_uploaded': 'Media Uploaded',
      'alert_resolved': 'Alert Resolved'
    }
    return typeMap[type] || type
  }

  return (
    <header className="bg-surface border-b border-outline px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-lg">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant h-4 w-4" />
            <input
              type="text"
              placeholder="Search emergencies, responders..."
              className="input-field w-full pl-10 pr-4"
            />
          </div> */}
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
          {activeEmergencyCount > 0 && (
            <div className="relative">
              <div className="w-3 h-3 bg-panic rounded-full animate-ping absolute -top-1 -right-1"></div>
              <div className="px-3 py-1 bg-panic/20 text-panic rounded-full text-sm font-medium">
                {activeEmergencyCount} Active
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
              onClick={() => {
                setShowNotifications(!showNotifications)
                if (!showNotifications) {
                  fetchNotifications() // Refresh when opening
                }
              }}
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
              <div className="absolute right-0 mt-2 w-96 bg-surface rounded-lg shadow-lg border border-outline z-50">
                <div className="p-4 border-b border-outline">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-on-surface">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:text-primary/80 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {activeEmergencyCount > 0 && (
                    <div className="mt-2 px-3 py-2 bg-panic/10 border border-panic/20 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-panic">Active Emergencies</span>
                        <span className="text-sm font-bold text-panic">{activeEmergencyCount}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-on-surface-variant mx-auto mb-3" />
                      <p className="text-on-surface-variant text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-outline hover:bg-surface-variant cursor-pointer transition-colors ${
                          !notification.is_read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                        }`}
                        onClick={() => {
                          if (!notification.is_read) {
                            markAsRead(notification.id)
                          }
                          // You can add navigation logic here based on notification type
                          if (notification.alert) {
                            navigate(`/emergencies/${notification.alert}`)
                          }
                          setShowNotifications(false)
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.notification_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-on-surface text-sm leading-tight">
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-primary rounded-full ml-2 flex-shrink-0 mt-1"></div>
                              )}
                            </div>
                            <p className="text-on-surface-variant text-sm mt-1 leading-tight">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-on-surface-variant capitalize">
                                {getNotificationTypeName(notification.notification_type)}
                              </span>
                              <span className="text-xs text-on-surface-variant">
                                {formatTimeAgo(notification.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* <div className="p-2 border-t border-outline">
                  <button 
                    className="w-full text-center text-sm text-primary hover:text-primary/80 py-2"
                    onClick={() => {
                      navigate('/notifications')
                      setShowNotifications(false)
                    }}
                  >
                    View All Notifications
                  </button>
                </div> */}
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
                  {/* <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-variant rounded-md transition-colors"
                  onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button> */}
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