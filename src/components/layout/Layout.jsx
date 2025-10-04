// src/components/layout/Layout.jsx
import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'


const Layout = ({ children }) => {
  const location = useLocation()
  const isAuthencated = location.pathname === '/login' || location.pathname === '/welcome'

  if (isAuthencated) {
    return <main className="min-h-screen bg-background">{children}</main>
  }

  return (
    <div className="min-h-screen bg-background flex transition-colors duration-200">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default Layout

