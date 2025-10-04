import React, { useEffect } from 'react'
import api from './api' // make sure this is the correct path

const TestApiConnection = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/auth/login/'); // or any GET endpoint your API supports
        console.log('✅ API response:', response.data)
        alert('✅ API connection successful! Check console for details.')
      } catch (err) {
        console.error('❌ API connection failed:', err)
        alert(`❌ API connection failed: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-4">
      <h2>Testing API Connection...</h2>
    </div>
  )
}

export default TestApiConnection
