// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react'
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
  Shield,
  Radio,
  Wifi
} from 'lucide-react'
import { useEmergencies } from '../../contexts/EmergencyContext'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const { emergencies } = useEmergencies()

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && isMobile && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        bg-surface border-r border-outline
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isCollapsed ? 'lg:w-20 w-0' : 'w-64'}
        ${isMobile && isCollapsed ? 'hidden' : ''}
        shadow-xl lg:shadow-none
      `}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-outline min-h-[4rem]">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-[#674fa4]" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-on-surface tracking-tight">Aegis</h1>
                <p className="text-xs text-on-surface-variant font-medium">Emergency Response</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Shield className="h-6 w-6 text-[#674fa4]" />
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-9 h-9 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-xl transition-all duration-200 hover:shadow-md"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={closeMobileSidebar}
              className={`
                group flex items-center relative px-3 py-3 text-sm font-medium rounded-xl
                transition-all duration-200 ease-out
                ${item.current
                  ? 'bg-primary/15 text-primary shadow-sm shadow-primary/20 border-l-4 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant hover:shadow-md'
                }
                ${isCollapsed ? 'justify-center' : 'justify-start'}
                hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              <item.icon className={`
                h-5 w-5 transition-transform duration-200
                ${isCollapsed ? '' : 'mr-3'}
                ${item.current ? 'scale-110' : ''}
              `} />
              
              {!isCollapsed && (
                <span className="flex-1 font-semibold tracking-wide">{item.name}</span>
              )}
              
              {item.badge && item.badge > 0 && (
                <span className={`
                  bg-panic text-on-panic text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center
                  shadow-lg shadow-panic/25
                  animate-pulse
                  ${isCollapsed ? 'absolute -top-1 -right-1 text-[10px]' : ''}
                  transition-transform duration-200 group-hover:scale-110
                `}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-container text-on-surface-container text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-2 bg-panic text-on-panic text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* System Status */}
        <div className={`p-4 border-t border-outline transition-all duration-300 ${isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="bg-success/10 border border-success/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-success">System Online</span>
              </div>
              <Wifi className="h-4 w-4 text-success" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-success/70">Network</span>
                <span className="font-medium text-success">Stable</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-success/70">Response Time</span>
                <span className="font-medium text-success">{"<2s"}</span>
              </div>
            </div>

            <div className="w-full bg-success/20 rounded-full h-1.5">
              <div 
                className="bg-success h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Collapsed Status Indicator */}
        {isCollapsed && (
          <div className="p-3 border-t border-outline">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <Radio className="h-4 w-4 text-success" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Toggle Button */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </>
  )
}

export default Sidebar