// src/services/api.js
import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor with better logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('API Interceptor - Token from localStorage:', token)
    console.log('API Interceptor - Request URL:', config.url)
    
    if (token) {
      config.headers.Authorization = `Token ${token}`
      console.log('API Interceptor - Authorization header set')
    } else {
      console.log('API Interceptor - No token found')
    }
    
    return config
  },
  (error) => {
    console.error('API Request Interceptor Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)

export default api