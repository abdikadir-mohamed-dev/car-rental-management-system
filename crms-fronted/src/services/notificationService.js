import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const notificationService = axios.create({
  baseURL: `${API_URL}/api/notifications`,
  headers: {
    'Content-Type': 'application/json',
  },
})

notificationService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

setAuthToken(localStorage.getItem('token'))

export const getNotifications = async (params) => {
  return await notificationService.get('/', { params })
}

export const markAsRead = async (id) => {
  return await notificationService.patch(`/${id}/read`)
}

export const markAllAsRead = async () => {
  return await notificationService.patch('/read-all')
}

export default notificationService
