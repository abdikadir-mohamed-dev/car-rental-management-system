import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const userService = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

userService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

setAuthToken(localStorage.getItem('token'))

export const getProfile = async () => {
  return await userService.get('/profile')
}

export const updateProfile = async (userData) => {
  return await userService.put('/profile', userData)
}

export const changePassword = async (passwordData) => {
  return await userService.put('/change-password', passwordData)
}

export default userService
