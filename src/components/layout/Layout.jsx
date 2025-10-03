// src/components/layout/Layout.jsx
import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className=" flex flex-1 flex-col ">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout