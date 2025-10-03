// src/contexts/EmergencyContext.jsx
import React, { createContext, useContext, useReducer } from 'react'

const EmergencyContext = createContext()

const emergencyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMERGENCIES':
      return { ...state, emergencies: action.payload }
    case 'ADD_EMERGENCY':
      return { ...state, emergencies: [action.payload, ...state.emergencies] }
    case 'UPDATE_EMERGENCY':
      return {
        ...state,
        emergencies: state.emergencies.map(emergency =>
          emergency.id === action.payload.id ? action.payload : emergency
        )
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export const EmergencyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(emergencyReducer, {
    emergencies: [
      // Mock data for testing
      {
        id: 'EMG-2024-0012',
        type: 'harassment',
        status: 'active',
        location: 'Gulshan 1, Dhaka',
        createdAt: new Date().toISOString()
      },
      {
        id: 'EMG-2024-0013',
        type: 'robbery',
        status: 'assigned',
        location: 'Dhanmondi, Dhaka',
        createdAt: new Date().toISOString()
      }
    ],
    loading: false
  })

  return (
    <EmergencyContext.Provider value={{ ...state, dispatch }}>
      {children}
    </EmergencyContext.Provider>
  )
}

export const useEmergencies = () => {
  const context = useContext(EmergencyContext)
  if (!context) {
    throw new Error('useEmergencies must be used within EmergencyProvider')
  }
  return context
}