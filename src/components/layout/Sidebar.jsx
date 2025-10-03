// src/components/layout/Sidebar.jsx
import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react'
import { useEmergencies } from '../../contexts/EmergencyContext'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const { emergencies } = useEmergencies()

  const activeEmergencies = emergencies.filter(e => 
    e.status === 'active' || e.status === 'assigned'
  ).length

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/',
      badge: null
    },
    {
      name: 'Emergencies',
      href: '/emergencies',
      icon: AlertTriangle,
      current: location.pathname === '/emergencies',
      badge: activeEmergencies
    },
    {
      name: 'Responders',
      href: '/responders',
      icon: Users,
      current: location.pathname === '/responders',
      badge: null
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: location.pathname === '/analytics',
      badge: null
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      current: location.pathname === '/reports',
      badge: null
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings',
      badge: null
    }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-surface border-r border-outline
        transform transition-transform duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'w-64'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-outline">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-on-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-on-surface">Aegis</h1>
                <p className="text-xs text-on-surface-variant">Control Center</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Shield className="h-5 w-5 text-on-primary" />
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                ${item.current
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
                }
                ${isCollapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
              
              {!isCollapsed && (
                <span className="flex-1">{item.name}</span>
              )}
              
              {item.badge && item.badge > 0 && (
                <span className={`
                  bg-panic/20 text-panic text-xs font-medium px-2 py-1 rounded-full
                  ${isCollapsed ? 'absolute top-2 right-2' : ''}
                `}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* System Status */}
        {!isCollapsed && (
          <div className="p-4 border-t border-outline">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">System Online</span>
              </div>
              <p className="text-xs text-green-500/70 dark:text-green-400/70 mt-1">All systems operational</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar