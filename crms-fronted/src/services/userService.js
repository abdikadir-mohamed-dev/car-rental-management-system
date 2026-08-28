import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const userService = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), userService)

export const getProfile = async () => {
  const response = await userService.get('/profile')
  return response.data.user || response.data
}

export const updateProfile = async (userData) => {
  const response = await userService.put('/profile', userData)
  return response.data.user || response.data
}

export const changePassword = async (passwordData) => {
  const response = await userService.put('/change-password', passwordData)
  return response.data
}

export default userService
