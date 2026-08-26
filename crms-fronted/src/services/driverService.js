import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const driverService = axios.create({
  baseURL: `${API_URL}/api/driver`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'))

export const getDriverDashboard = async () => {
  return await driverService.get('/dashboard')
}

export const getAssignments = async (params) => {
  return await driverService.get('/assignments', { params })
}

export const getTrips = async (params) => {
  return await driverService.get('/trips', { params })
}

export const getTrip = async (id) => {
  return await driverService.get(`/trips/${id}`)
}

export const updateTripStatus = async (id, status) => {
  return await driverService.patch(`/trips/${id}/status`, { status })
}

export const getEarnings = async (params) => {
  return await driverService.get('/earnings', { params })
}

export const getEarningsSummary = async (params) => {
  return await driverService.get('/earnings/summary', { params })
}

export const getBookings = async (params) => {
  return await driverService.get('/bookings', { params })
}

export const getVehicles = async (params) => {
  return await driverService.get('/vehicles', { params })
}

export const getCustomers = async (params) => {
  return await driverService.get('/customers', { params })
}

export const getMaintenance = async (params) => {
  return await driverService.get('/maintenance', { params })
}

export const createMaintenance = async (data) => {
  return await driverService.post('/maintenance', data)
}

export const getReports = async (params) => {
  return await driverService.get('/reports', { params })
}

export const getNotifications = async (params) => {
  return await driverService.get('/notifications', { params })
}

export const markNotificationRead = async (id) => {
  return await driverService.patch(`/notifications/${id}/read`)
}

export const markAllNotificationsRead = async () => {
  return await driverService.patch('/notifications/read-all')
}

export const getPayments = async (params) => {
  return await driverService.get('/payments', { params })
}

export default driverService
