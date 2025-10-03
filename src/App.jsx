// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { EmergencyProvider } from './contexts/EmergencyContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Emergencies from './pages/Emergencies'
import Responders from './pages/Responders'
import Messages from './pages/Messages'
import Evidence from './pages/Evidence'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import Resources from './pages/Resources'
import Settings from './pages/Settings'
import './styles/globals.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <EmergencyProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/emergencies" element={<Emergencies />} />
              <Route path="/responders" element={<Responders />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </EmergencyProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App