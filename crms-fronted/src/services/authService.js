import axios from 'axios'
import { VITE_API_URL } from '../utils/constants'

const API_URL = import.meta.env.VITE_API_URL || VITE_API_URL

const authService = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Always use the latest token from localStorage
authService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Keep this function because other services may import it
export const setAuthToken = (token, service = authService) => {
  if (token) {
    service.defaults.headers.common['Authorization'] =
      `Bearer ${token}`
  } else {
    delete service.defaults.headers.common['Authorization']
  }
}

export const login = async (credentials) => {
  const response = await authService.post(
    '/login',
    credentials
  )

  return response
}

export const register = async (userData) => {
  const response = await authService.post(
    '/register',
    userData
  )

  return response
}

export const logout = async () => {
  try {
    const response = await authService.post('/logout')
    return response
  } finally {
    // Always remove the local token when logging out
    localStorage.removeItem('token')

    // Also remove any old default authorization header
    delete authService.defaults.headers.common[
      'Authorization'
    ]
  }
}

export const forgotPassword = async (email) => {
  return await authService.post(
    '/forgot-password',
    { email }
  )
}

export const resetPassword = async (
  token,
  password
) => {
  return await authService.post(
    `/reset-password/${token}`,
    { password }
  )
}

export const getProfile = async () => {
  return await authService.get('/profile')
}

export default authService