import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const notificationService = axios.create({
  baseURL: `${API_URL}/api/notifications`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), notificationService)

export const getNotifications = async (userId) => {
  const response = await notificationService.get('/', { params: { user_id: userId } })
  return response.data
}

export const getUnreadCount = async () => {
  const response = await notificationService.get('/unread-count')
  return response.data
}

export const getNotification = async (id) => {
  const response = await notificationService.get(`/${id}`)
  return response.data
}

export const markAsRead = async (id) => {
  const response = await notificationService.put(`/${id}/read`)
  return response.data
}

export const markAllAsRead = async () => {
  const response = await notificationService.put('/read-all')
  return response.data
}

export default notificationService
