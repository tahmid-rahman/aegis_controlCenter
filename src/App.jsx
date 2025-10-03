// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { EmergencyProvider } from './contexts/EmergencyContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Emergencies from './pages/Emergencies'
import Responders from './pages/Responders'
// import Analytics from './pages/Analytics'
// import Reports from './pages/Reports'
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
              {/* <Route path="/analytics" element={<Analytics />} /> */}
              {/* <Route path="/reports" element={<Reports />} /> */}
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </EmergencyProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App