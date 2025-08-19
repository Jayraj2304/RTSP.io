import axios from 'axios'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:5000/api'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Normalize error responses
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response
      return Promise.reject({
        message: data?.error || 'An error occurred',
        details: data?.details,
        status,
      })
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: 'Network error - please check your connection',
        status: 0,
      })
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      })
    }
  }
)

export type ApiError = {
  message: string
  details?: any
  status: number
}
