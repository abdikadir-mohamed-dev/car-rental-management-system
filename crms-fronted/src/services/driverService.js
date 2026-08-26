import axios from 'axios'
import { setAuthToken } from './authService'

const API_URL = import.meta.env.VITE_API_URL

const driverService = axios.create({
  baseURL: `${API_URL}/driver`,
  headers: {
    'Content-Type': 'application/json',
  },
})

driverService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

setAuthToken(localStorage.getItem('token'))

export const getDriverDashboard = async () => {
  return await driverService.get('/dashboard')
}

export const getTrips = async (params) => {
  return await driverService.get('/trips', { params })
}

export const getTrip = async (id) => {
  return await driverService.get(`/trips/${id}`)
}

export const updateTripStatus = async (id, status) => {
  return await driverService.put(`/trips/${id}/status`, { status })
}

export const getEarnings = async (params) => {
  return await driverService.get('/earnings', { params })
}

export default driverService
