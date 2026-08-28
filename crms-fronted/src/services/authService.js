import axios from 'axios'
import { VITE_API_URL } from '../utils/constants'

const API_URL = import.meta.env.VITE_API_URL || VITE_API_URL

const authService = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token, service = authService) => {
  if (token) {
    service.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete service.defaults.headers.common['Authorization']
  }
}

export const login = async (credentials) => {
  return await authService.post('/login', credentials)
}

export const register = async (userData) => {
  return await authService.post('/register', userData)
}

export const logout = async () => {
  return await authService.post('/logout')
}

export const forgotPassword = async (email) => {
  return await authService.post('/forgot-password', { email })
}

export const resetPassword = async (token, password) => {
  return await authService.post(`/reset-password/${token}`, { password })
}

export const getProfile = async () => {
  return await authService.get('/profile')
}

setAuthToken(localStorage.getItem('token'), authService)

export default authService
