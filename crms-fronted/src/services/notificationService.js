import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const notificationService = axios.create({
  baseURL: `${API_URL}/notifications`,
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

export const getNotifications = async () => {
  return await notificationService.get('/')
}

export const getNotification = async (id) => {
  return await notificationService.get(`/${id}`)
}

export const markAsRead = async (id) => {
  return await notificationService.put(`/${id}/read`)
}

export const markAllAsRead = async () => {
  return await notificationService.put('/read-all')
}

export default notificationService
