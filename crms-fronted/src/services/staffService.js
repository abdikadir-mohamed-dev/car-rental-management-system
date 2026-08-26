import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const staffService = axios.create({
  baseURL: `${API_URL}/staff`,
  headers: {
    'Content-Type': 'application/json',
  },
})

staffService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

setAuthToken(localStorage.getItem('token'))

export const getStaffDashboard = async () => {
  return await staffService.get('/dashboard')
}

export const getPendingBookings = async () => {
  return await staffService.get('/bookings/pending')
}

export const approveBooking = async (id, data) => {
  return await staffService.put(`/bookings/${id}/approve`, data)
}

export const rejectBooking = async (id, data) => {
  return await staffService.put(`/bookings/${id}/reject`, data)
}

export const getTrips = async (params) => {
  return await staffService.get('/trips', { params })
}

export const updateTripStatus = async (id, status) => {
  return await staffService.put(`/trips/${id}/status`, { status })
}

export const getVehiclesForInspection = async () => {
  return await staffService.get('/vehicles/inspection')
}

export const updateVehicleInspection = async (id, data) => {
  return await staffService.put(`/vehicles/${id}/inspection`, data)
}

export default staffService
